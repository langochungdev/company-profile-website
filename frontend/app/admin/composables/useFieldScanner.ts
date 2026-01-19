/**
 * Composable: Auto-scan và setup editable fields trong DOM
 */

import { ref, onMounted, onUnmounted, nextTick, watch, type Ref } from "vue";

export interface FieldScannerOptions {
    containerRef: Ref<HTMLElement | null>;
    sectionId: string;
    onFieldClick: (sectionId: string, fieldPath: string) => void;
    enabled?: Ref<boolean>;
}

export interface ScannedField {
    element: HTMLElement;
    path: string;
    sectionId: string;
}

export const useFieldScanner = (options: FieldScannerOptions) => {
    const { containerRef, sectionId, onFieldClick, enabled } = options;
    const scannedFields = ref<ScannedField[]>([]);
    let observer: MutationObserver | null = null;

    const scanFields = () => {
        if (!containerRef.value || (enabled && !enabled.value)) return;

        const elements = containerRef.value.querySelectorAll("[data-field]");
        scannedFields.value = [];

        elements.forEach((el) => {
            const element = el as HTMLElement;
            const fieldPath = element.dataset.field;

            if (!fieldPath) return;

            scannedFields.value.push({
                element,
                path: fieldPath,
                sectionId,
            });

            setupFieldElement(element, fieldPath);
        });
    };

    const setupFieldElement = (element: HTMLElement, fieldPath: string) => {
        element.classList.add("scannable-field");

        const parentLink = element.closest("a");
        if (parentLink && !parentLink.classList.contains("link-disabled-for-edit")) {
            parentLink.classList.add("link-disabled-for-edit");
            parentLink.style.pointerEvents = "none";

            const linkClickHandler = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
            };
            (parentLink as any).__linkClickHandler = linkClickHandler;
            parentLink.addEventListener("click", linkClickHandler, { capture: true });
        }

        element.style.pointerEvents = "auto";
        element.style.position = "relative";
        element.style.cursor = "pointer";

        const existingHandler = (element as any).__fieldClickHandler;
        if (existingHandler) {
            element.removeEventListener("click", existingHandler, { capture: true });
        }

        const clickHandler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            onFieldClick(sectionId, fieldPath);
        };

        (element as any).__fieldClickHandler = clickHandler;
        element.addEventListener("click", clickHandler, { capture: true });

        const isVoidElement = ["IMG", "INPUT", "BR", "HR"].includes(element.tagName);

        if (isVoidElement) {
            if (!element.parentElement?.querySelector(`.field-edit-indicator[data-for="${fieldPath}"]`)) {
                const indicator = document.createElement("span");
                indicator.className = "field-edit-indicator";
                indicator.setAttribute("data-for", fieldPath);
                indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`;

                const wrapper = element.parentElement;
                if (wrapper) {
                    wrapper.style.position = "relative";
                    wrapper.appendChild(indicator);
                }
            }
        } else {
            if (!element.querySelector(".field-edit-indicator")) {
                const indicator = document.createElement("span");
                indicator.className = "field-edit-indicator";
                indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`;
                element.appendChild(indicator);
            }
        }
    };

    const cleanup = () => {
        scannedFields.value.forEach(({ element, path }) => {
            const handler = (element as any).__fieldClickHandler;
            if (handler) {
                element.removeEventListener("click", handler, { capture: true });
                delete (element as any).__fieldClickHandler;
            }
            element.classList.remove("scannable-field");
            element.style.pointerEvents = "";
            element.style.position = "";
            element.style.cursor = "";

            const isVoidElement = ["IMG", "INPUT", "BR", "HR"].includes(element.tagName);
            if (isVoidElement) {
                const indicator = element.parentElement?.querySelector(`.field-edit-indicator[data-for="${path}"]`);
                if (indicator) indicator.remove();
            } else {
                const indicator = element.querySelector(".field-edit-indicator");
                if (indicator) indicator.remove();
            }

            const parentLink = element.closest("a.link-disabled-for-edit") as HTMLElement | null;
            if (parentLink) {
                const linkHandler = (parentLink as any).__linkClickHandler;
                if (linkHandler) {
                    parentLink.removeEventListener("click", linkHandler, { capture: true });
                    delete (parentLink as any).__linkClickHandler;
                }
                parentLink.classList.remove("link-disabled-for-edit");
                parentLink.style.pointerEvents = "";
            }
        });
        scannedFields.value = [];
    };

    const startObserving = () => {
        if (!containerRef.value) return;

        observer = new MutationObserver(() => {
            nextTick(() => scanFields());
        });

        observer.observe(containerRef.value, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-field"],
        });
    };

    const stopObserving = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };

    if (enabled) {
        watch(
            enabled,
            (isEnabled) => {
                if (isEnabled) {
                    nextTick(() => {
                        scanFields();
                        startObserving();
                    });
                } else {
                    cleanup();
                    stopObserving();
                }
            },
            { immediate: true },
        );
    }

    watch(containerRef, (newVal) => {
        if (newVal && (!enabled || enabled.value)) {
            nextTick(() => {
                scanFields();
                startObserving();
            });
        }
    });

    onMounted(() => {
        if (!enabled || enabled.value) {
            nextTick(() => {
                scanFields();
                startObserving();
            });
        }
    });

    onUnmounted(() => {
        cleanup();
        stopObserving();
    });

    return {
        scannedFields,
        rescan: scanFields,
        cleanup,
    };
};
