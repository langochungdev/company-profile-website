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

        const textElements = containerRef.value.querySelectorAll("[data-field]");
        const linkElements = containerRef.value.querySelectorAll("[data-field-link]");
        scannedFields.value = [];

        textElements.forEach((el) => {
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

        linkElements.forEach((el) => {
            const element = el as HTMLElement;
            const fieldPath = element.dataset.fieldLink;

            if (!fieldPath) return;

            scannedFields.value.push({
                element,
                path: fieldPath,
                sectionId,
            });

            setupLinkField(element, fieldPath);
        });
    };

    const setupFieldElement = (element: HTMLElement, fieldPath: string) => {
        if (element.classList.contains("scannable-field")) return;

        element.classList.add("scannable-field");

        const isImageField = element.dataset.fieldType === "image";

        if (isImageField) {
            setupImageField(element, fieldPath);
            return;
        }

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
        const computedPosition = window.getComputedStyle(element).position;
        if (computedPosition === "static") {
            element.style.position = "relative";
            (element as any).__originalPosition = "static";
        }
        element.style.cursor = "pointer";

        const existingHandler = (element as any).__fieldClickHandler;
        if (existingHandler) {
            element.removeEventListener("click", existingHandler);
        }

        const clickHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            const closestScannable = target.closest(".scannable-field");
            if (closestScannable !== element) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            onFieldClick(sectionId, fieldPath);
        };

        (element as any).__fieldClickHandler = clickHandler;
        element.addEventListener("click", clickHandler);

        if (!element.querySelector(".field-edit-indicator")) {
            const indicator = document.createElement("span");
            indicator.className = "field-edit-indicator";
            indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`;
            element.appendChild(indicator);
        }
    };

    const setupImageField = (element: HTMLElement, fieldPath: string) => {
        if (element.classList.contains("image-edit-wrapper")) return;

        element.classList.add("image-edit-wrapper");

        const card = element.closest(".news-card, .project-card, .service-card, .cert-card, .partner-card, [class*='-card']");
        const buttonContainer = card || element;

        if (buttonContainer.querySelector(`.image-edit-button[data-for="${fieldPath}"]`)) return;

        const button = document.createElement("button");
        button.className = "image-edit-button";
        button.setAttribute("data-for", fieldPath);
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
        button.title = "Thay đổi ảnh";

        const clickHandler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            onFieldClick(sectionId, fieldPath);
        };

        (button as any).__fieldClickHandler = clickHandler;
        button.addEventListener("click", clickHandler, { capture: true });

        buttonContainer.appendChild(button);
        (element as any).__imageButtonContainer = buttonContainer;
    };

    const setupLinkField = (element: HTMLElement, fieldPath: string) => {
        if (element.classList.contains("link-edit-wrapper")) return;

        element.classList.add("link-edit-wrapper");

        const computedPosition = window.getComputedStyle(element).position;
        if (computedPosition === "static") {
            element.style.position = "relative";
            (element as any).__originalLinkPosition = "static";
        }

        if (element.querySelector(`.link-edit-button[data-for="${fieldPath}"]`)) return;

        const button = document.createElement("button");
        button.className = "link-edit-button";
        button.setAttribute("data-for", fieldPath);
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
        button.title = "Thay đổi link";

        const clickHandler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            onFieldClick(sectionId, fieldPath);
        };

        (button as any).__fieldClickHandler = clickHandler;
        button.addEventListener("click", clickHandler, { capture: true });

        element.appendChild(button);
        (element as any).__linkButtonContainer = element;
    };

    const cleanup = () => {
        scannedFields.value.forEach(({ element, path }) => {
            const handler = (element as any).__fieldClickHandler;
            if (handler) {
                element.removeEventListener("click", handler);
                delete (element as any).__fieldClickHandler;
            }
            element.classList.remove("scannable-field");
            element.classList.remove("image-edit-wrapper");
            element.classList.remove("link-edit-wrapper");
            element.style.pointerEvents = "";
            if ((element as any).__originalPosition === "static") {
                element.style.position = "";
                delete (element as any).__originalPosition;
            }
            element.style.cursor = "";

            const imageButtonContainer = (element as any).__imageButtonContainer || element;
            const imageButton = imageButtonContainer.querySelector(`.image-edit-button[data-for="${path}"]`);
            if (imageButton) {
                const btnHandler = (imageButton as any).__fieldClickHandler;
                if (btnHandler) {
                    imageButton.removeEventListener("click", btnHandler, { capture: true });
                }
                imageButton.remove();
            }
            delete (element as any).__imageButtonContainer;

            const linkButtonContainer = (element as any).__linkButtonContainer || element;
            const linkButton = linkButtonContainer.querySelector(`.link-edit-button[data-for="${path}"]`);
            if (linkButton) {
                const btnHandler = (linkButton as any).__fieldClickHandler;
                if (btnHandler) {
                    linkButton.removeEventListener("click", btnHandler, { capture: true });
                }
                linkButton.remove();
            }
            delete (element as any).__linkButtonContainer;

            const indicator = element.querySelector(".field-edit-indicator");
            if (indicator) indicator.remove();

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

        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        let isProcessing = false;

        observer = new MutationObserver((mutations) => {
            const hasRelevantChange = mutations.some((m) => {
                if (m.type === "attributes") return true;
                if (m.type === "childList") {
                    const addedNodes = Array.from(m.addedNodes);
                    const removedNodes = Array.from(m.removedNodes);
                    return [...addedNodes, ...removedNodes].some((node) => node instanceof HTMLElement && (node.hasAttribute("data-field") || node.hasAttribute("data-field-link") || node.querySelector("[data-field]") !== null || node.querySelector("[data-field-link]") !== null));
                }
                return false;
            });

            if (!hasRelevantChange || isProcessing) return;

            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                isProcessing = true;
                scanFields();
                isProcessing = false;
            }, 100);
        });

        observer.observe(containerRef.value, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-field", "data-field-link"],
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
