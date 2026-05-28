const getTarget = (root, selector) => {
  if (!selector) {
    return null;
  }

  return root.querySelector(selector);
};

const setPanelState = (button, target, isExpanded) => {
  button.classList.toggle("collapsed", !isExpanded);
  button.setAttribute("aria-expanded", String(isExpanded));

  target.classList.toggle("collapse", !isExpanded);
  target.setAttribute("aria-expanded", String(isExpanded));
};

export const initializeCollapsePanels = (root = document) => {
  Array.from(root.querySelectorAll('[data-toggle="collapse"]')).forEach(
    (button) => {
      const target = getTarget(root, button.getAttribute("data-target"));

      if (!target) {
        return;
      }

      const isExpanded = !button.classList.contains("collapsed");
      const targetId = target.getAttribute("id");

      if (targetId) {
        button.setAttribute("aria-controls", targetId);
      }

      setPanelState(button, target, isExpanded);

      button.addEventListener("click", () => {
        const parentSelector = button.getAttribute("data-parent");
        const shouldExpand = target.classList.contains("collapse");

        if (parentSelector && shouldExpand) {
          const parent = root.querySelector(parentSelector);

          if (parent?.hasAttribute("data-accordion")) {
            Array.from(
              parent.querySelectorAll('[data-toggle="collapse"]')
            ).forEach((siblingButton) => {
              if (siblingButton === button) {
                return;
              }

              const siblingTarget = getTarget(
                root,
                siblingButton.getAttribute("data-target")
              );

              if (
                siblingTarget &&
                !siblingTarget.classList.contains("collapse")
              ) {
                setPanelState(siblingButton, siblingTarget, false);
              }
            });
          }
        }

        setPanelState(button, target, shouldExpand);
      });
    }
  );
};

const updateQuestionFieldVisibility = (root, numberOfQuestions) => {
  for (let index = 0; index < 5; index++) {
    const questionInput = root.querySelector(
      `input[name="question_${index + 1}"]`
    );
    const questionField = questionInput?.closest(".form-group");

    if (questionField) {
      setElementVisibility(questionField, index < numberOfQuestions);
    }
  }
};

export const initializeQuestionFields = (root = document) => {
  const questionCountInput = root.querySelector('input[name="questions_count"]');

  if (!questionCountInput) {
    return;
  }

  const parseQuestionCount = (rawValue) => parseInt(rawValue || "0", 10) || 0;
  const getQuestionCount = () =>
    parseQuestionCount(
      questionCountInput.value || questionCountInput.getAttribute("value")
    );
  let currentQuestionCount = getQuestionCount();

  const syncQuestionFields = () => {
    updateQuestionFieldVisibility(root, currentQuestionCount);
  };
  const handleQuestionCountUpdate = (event) => {
    const nextValue = event?.target?.value;

    if (nextValue !== undefined) {
      questionCountInput.setAttribute("value", String(nextValue));
      currentQuestionCount = parseQuestionCount(nextValue);
    } else {
      currentQuestionCount = getQuestionCount();
    }

    syncQuestionFields();
  };
  const syncQuestionFieldsFromInput = () => {
    const nextQuestionCount = getQuestionCount();

    if (nextQuestionCount === currentQuestionCount) {
      return;
    }

    currentQuestionCount = nextQuestionCount;
    syncQuestionFields();
  };

  syncQuestionFields();
  questionCountInput.addEventListener("change", handleQuestionCountUpdate);
  questionCountInput.addEventListener("input", handleQuestionCountUpdate);
  questionCountInput.addEventListener("blur", handleQuestionCountUpdate);
  questionCountInput.addEventListener("keyup", handleQuestionCountUpdate);
  questionCountInput.addEventListener("click", handleQuestionCountUpdate);

  const valueObserver = new MutationObserver(() => {
    syncQuestionFieldsFromInput();
  });
  valueObserver.observe(questionCountInput, {
    attributes: true,
    attributeFilter: ["value"],
  });

  setInterval(syncQuestionFieldsFromInput, 150);

  [0, 50, 150, 300].forEach((delay) => {
    setTimeout(() => {
      currentQuestionCount = getQuestionCount();
      syncQuestionFields();
    }, delay);
  });
};

const syncEnabledTargets = (root, inputName) => {
  const controllerInputs = Array.from(
    root.querySelectorAll(`input[name="${inputName}"][data-enables]`)
  );

  controllerInputs.forEach((controllerInput) => {
    const target = getTarget(root, controllerInput.getAttribute("data-enables"));

    if (!target) {
      return;
    }

    setElementVisibility(target, controllerInput.checked);
  });
};

export const initializeEnabledFields = (root = document) => {
  const handledNames = new Set();

  Array.from(root.querySelectorAll("input[data-enables]")).forEach((input) => {
    const inputName = input.getAttribute("name");

    if (!inputName || handledNames.has(inputName)) {
      return;
    }

    handledNames.add(inputName);

    const syncFieldTargets = () => {
      syncEnabledTargets(root, inputName);
    };

    Array.from(root.querySelectorAll(`input[name="${inputName}"]`)).forEach(
      (relatedInput) => {
        relatedInput.addEventListener("change", syncFieldTargets);
      }
    );

    syncFieldTargets();
    [0, 50, 150, 300].forEach((delay) => {
      setTimeout(syncFieldTargets, delay);
    });
  });
};

const setElementVisibility = (element, isVisible) => {
  if (!element) {
    return;
  }

  element.hidden = !isVisible;
  element.style.display = isVisible ? "" : "none";
};

const getManualElements = (
  fieldContainer,
  manualControl,
  metadataToggleContainer
) => {
  const manualElements = [manualControl];
  let sibling = manualControl.nextElementSibling;

  while (sibling && sibling !== metadataToggleContainer) {
    manualElements.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  return manualElements;
};

const applyMetadataFieldState = (fieldContainer) => {
  const manualControl = fieldContainer.querySelector("[data-metadata-manual]");
  const metadataToggle = fieldContainer.querySelector("[data-metadata-toggle]");
  const metadataToggleContainer = fieldContainer.querySelector(
    ":scope > .checkbox"
  );
  const metadataSelectorContainer = fieldContainer.querySelector(
    "[data-metadata-selector-container]"
  );

  if (
    !manualControl ||
    !metadataToggle ||
    !metadataToggleContainer ||
    !metadataSelectorContainer
  ) {
    return;
  }

  const useMetadata = metadataToggle.checked;
  getManualElements(
    fieldContainer,
    manualControl,
    metadataToggleContainer
  ).forEach((element) => {
    setElementVisibility(element, !useMetadata);
  });
  setElementVisibility(metadataSelectorContainer, useMetadata);
};

const getGeneratedLabelText = (manualControl) => {
  const labelClone = manualControl.cloneNode(true);

  Array.from(labelClone.querySelectorAll("input")).forEach((input) => {
    input.remove();
  });

  return labelClone.textContent?.trim() || "";
};

const initializeMetadataFieldLayout = (fieldContainer) => {
  const existingHeaderRow = fieldContainer.querySelector(
    ":scope > [data-metadata-header-row]"
  );

  if (existingHeaderRow) {
    return;
  }

  const manualControl = fieldContainer.querySelector("[data-metadata-manual]");
  const metadataToggleContainer = fieldContainer.querySelector(
    ":scope > .checkbox"
  );

  if (!manualControl || !metadataToggleContainer) {
    return;
  }

  const isCheckboxField = manualControl.tagName === "LABEL";
  const primaryLabel = isCheckboxField
    ? (() => {
        const generatedLabel = document.createElement("label");
        generatedLabel.setAttribute("data-metadata-generated-label", "");
        generatedLabel.textContent = getGeneratedLabelText(manualControl);
        return generatedLabel;
      })()
    : fieldContainer.querySelector(":scope > label");
  const metadataToggleLabel = metadataToggleContainer.querySelector(
    ":scope > label"
  );
  const metadataSelectorContainer = metadataToggleContainer.querySelector(
    "[data-metadata-selector-container]"
  );

  if (!primaryLabel || !metadataToggleLabel || !metadataSelectorContainer) {
    return;
  }

  const headerRow = document.createElement("div");
  headerRow.setAttribute("data-metadata-header-row", "");
  headerRow.style.display = "flex";
  headerRow.style.alignItems = "center";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.gap = "12px";
  headerRow.style.flexWrap = "wrap";
  headerRow.style.marginBottom = "6px";

  metadataToggleLabel.style.margin = "0";
  metadataToggleLabel.style.flexShrink = "0";
  metadataToggleContainer.style.margin = "0";

  fieldContainer.insertBefore(headerRow, fieldContainer.firstChild);
  headerRow.appendChild(primaryLabel);
  headerRow.appendChild(metadataToggleLabel);
  metadataToggleContainer.insertBefore(
    metadataSelectorContainer,
    metadataToggleContainer.firstChild
  );
};

export const initializeMetadataFields = (root = document) => {
  Array.from(root.querySelectorAll("[data-metadata-field]")).forEach(
    (fieldContainer) => {
      const metadataToggle = fieldContainer.querySelector(
        "[data-metadata-toggle]"
      );

      if (!metadataToggle) {
        return;
      }

      initializeMetadataFieldLayout(fieldContainer);
      applyMetadataFieldState(fieldContainer);
      metadataToggle.addEventListener("change", () => {
        applyMetadataFieldState(fieldContainer);
      });

      [0, 50, 150, 300].forEach((delay) => {
        setTimeout(() => {
          applyMetadataFieldState(fieldContainer);
        }, delay);
      });
    }
  );
};
