import {
  initializeEnabledFields,
  initializeMetadataFields,
  initializeQuestionFields,
} from "./config.helpers";

describe("config metadata fields", () => {
  test("shows the metadata selector and hides the manual input when enabled", () => {
    document.body.innerHTML = `
      <div class="form-group" data-metadata-field>
        <label>Assistant name</label>
        <input class="form-control" name="assistant_name" data-metadata-manual />
        <div class="mock-widget">Rendered widget</div>
        <div class="checkbox">
          <label>
            <input
              type="checkbox"
              name="assistant_name__useMetadata"
              data-metadata-toggle
            />
          </label>
          <div data-metadata-selector-container>
            <select name="assistant_name__metadata"></select>
          </div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);

    const manualInput = document.querySelector('[name="assistant_name"]');
    const manualWidget = document.querySelector(".mock-widget");
    const toggle = document.querySelector('[name="assistant_name__useMetadata"]');
    const selectorContainer = document.querySelector(
      "[data-metadata-selector-container]"
    );

    expect(manualInput.hidden).toBe(false);
    expect(manualWidget.hidden).toBe(false);
    expect(selectorContainer.hidden).toBe(true);

    toggle.checked = true;
    toggle.dispatchEvent(new Event("change"));

    expect(manualInput.hidden).toBe(true);
    expect(manualWidget.hidden).toBe(true);
    expect(selectorContainer.hidden).toBe(false);
  });

  test("renders the metadata toggle inline while keeping the selector below the field", () => {
    document.body.innerHTML = `
      <div class="form-group" data-metadata-field>
        <label>Assistant name</label>
        <input class="form-control" name="assistant_name" data-metadata-manual />
        <div class="checkbox">
          <label>
            <input
              type="checkbox"
              name="assistant_name__useMetadata"
              data-metadata-toggle
            />
            Use metadata
          </label>
          <div data-metadata-selector-container>
            <select name="assistant_name__metadata"></select>
          </div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);

    const field = document.querySelector("[data-metadata-field]");
    const headerRow = field.firstElementChild;
    const selectorContainer = document.querySelector(
      "[data-metadata-selector-container]"
    );
    const metadataToggleContainer = document.querySelector(".checkbox");

    expect(headerRow.children).toHaveLength(2);
    expect(headerRow.firstElementChild.tagName).toBe("LABEL");
    expect(headerRow.lastElementChild.textContent).toContain("Use metadata");
    expect(metadataToggleContainer.firstElementChild).toBe(selectorContainer);
  });

  test("restores the manual input when metadata mode is disabled", () => {
    document.body.innerHTML = `
      <div class="form-group" data-metadata-field>
        <label>Assistant name</label>
        <input class="form-control" name="assistant_name" data-metadata-manual />
        <div class="checkbox">
          <label>
            <input
              type="checkbox"
              name="assistant_name__useMetadata"
              data-metadata-toggle
              checked
            />
          </label>
          <div data-metadata-selector-container>
            <select name="assistant_name__metadata"></select>
          </div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);

    const manualInput = document.querySelector('[name="assistant_name"]');
    const toggle = document.querySelector('[name="assistant_name__useMetadata"]');
    const selectorContainer = document.querySelector(
      "[data-metadata-selector-container]"
    );

    toggle.checked = false;
    toggle.dispatchEvent(new Event("change"));

    expect(manualInput.hidden).toBe(false);
    expect(selectorContainer.hidden).toBe(true);
  });

  test("supports metadata mode for checkbox-backed fields", () => {
    document.body.innerHTML = `
      <div class="form-group" data-metadata-field>
        <label data-metadata-manual>
          <input type="checkbox" name="use_questions" />
          Use predefined questions
        </label>
        <div class="checkbox">
          <label>
            <input
              type="checkbox"
              name="use_questions__useMetadata"
              data-metadata-toggle
              checked
            />
            Use metadata
          </label>
          <div data-metadata-selector-container>
            <select name="use_questions__metadata"></select>
          </div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);

    const manualCheckboxLabel = document.querySelector('[name="use_questions"]')
      .closest("label");
    const selectorContainer = document.querySelector(
      "[data-metadata-selector-container]"
    );
    const field = document.querySelector("[data-metadata-field]");
    const headerRow = field.firstElementChild;
    const generatedLabel = field.querySelector("[data-metadata-generated-label]");

    expect(headerRow.children).toHaveLength(2);
    expect(manualCheckboxLabel.hidden).toBe(true);
    expect(selectorContainer.hidden).toBe(false);
    expect(generatedLabel.textContent).toContain("Use predefined questions");
  });

  test("reapplies metadata mode after delayed checkbox state restore", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div class="form-group" data-metadata-field>
        <label>Assistant name</label>
        <input class="form-control" name="assistant_name" data-metadata-manual />
        <div class="checkbox">
          <label>
            <input
              type="checkbox"
              name="assistant_name__useMetadata"
              data-metadata-toggle
            />
            Use metadata
          </label>
          <div data-metadata-selector-container>
            <select name="assistant_name__metadata"></select>
          </div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);

    const manualInput = document.querySelector('[name="assistant_name"]');
    const toggle = document.querySelector('[name="assistant_name__useMetadata"]');
    const selectorContainer = document.querySelector(
      "[data-metadata-selector-container]"
    );

    toggle.checked = true;
    jest.advanceTimersByTime(500);

    expect(manualInput.hidden).toBe(true);
    expect(selectorContainer.hidden).toBe(false);

    jest.clearAllTimers();
    jest.useRealTimers();
  });
});

describe("config question visibility", () => {
  test("shows predefined questions when the enabling checkbox is checked", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div>
        <label>
          <input
            type="checkbox"
            name="use_questions"
            data-enables=".pre-defined-questions"
            checked
          />
          Use predefined questions
        </label>
        <div class="pre-defined-questions">
          <input name="questions_count" value="2" />
          <div class="form-group"><input name="question_1" /></div>
          <div class="form-group"><input name="question_2" /></div>
          <div class="form-group"><input name="question_3" /></div>
        </div>
      </div>
    `;

    initializeEnabledFields(document);
    initializeQuestionFields(document);
    jest.advanceTimersByTime(500);

    const questionsSection = document.querySelector(".pre-defined-questions");
    const question3 = document.querySelector('[name="question_3"]').parentElement;

    expect(questionsSection.hidden).toBe(false);
    expect(question3.hidden).toBe(true);

    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("shows predefined questions when metadata mode is enabled for use_questions", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div>
        <div class="form-group" data-metadata-field>
          <label data-metadata-manual>
            <input
              type="checkbox"
              name="use_questions"
              data-enables=".pre-defined-questions"
            />
            Use predefined questions
          </label>
          <div class="checkbox">
            <label>
              <input
                type="checkbox"
                name="use_questions__useMetadata"
                data-metadata-toggle
                checked
              />
              Use metadata
            </label>
            <div data-metadata-selector-container>
              <select name="use_questions__metadata"></select>
            </div>
          </div>
        </div>
        <div class="pre-defined-questions">
          <input name="questions_count" value="2" />
          <div class="form-group"><input name="question_1" /></div>
          <div class="form-group"><input name="question_2" /></div>
          <div class="form-group"><input name="question_3" /></div>
        </div>
      </div>
    `;

    initializeMetadataFields(document);
    initializeEnabledFields(document);
    initializeQuestionFields(document);
    jest.advanceTimersByTime(500);

    const questionsSection = document.querySelector(".pre-defined-questions");
    const question3 = document.querySelector('[name="question_3"]').closest(".form-group");

    expect(questionsSection.hidden).toBe(false);
    expect(question3.hidden).toBe(true);

    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("keeps question count visibility logic working with metadata enhancements", () => {
    document.body.innerHTML = `
      <div>
        <input name="questions_count" value="2" />
        <div class="form-group" data-metadata-field>
          <input name="question_1" data-metadata-manual />
          <div class="checkbox">
            <label><input type="checkbox" name="question_1__useMetadata" data-metadata-toggle /></label>
            <div data-metadata-selector-container><select name="question_1__metadata"></select></div>
          </div>
        </div>
        <div class="form-group" data-metadata-field>
          <input name="question_2" data-metadata-manual />
          <div class="checkbox">
            <label><input type="checkbox" name="question_2__useMetadata" data-metadata-toggle /></label>
            <div data-metadata-selector-container><select name="question_2__metadata"></select></div>
          </div>
        </div>
        <div class="form-group" data-metadata-field>
          <input name="question_3" data-metadata-manual />
          <div class="checkbox">
            <label><input type="checkbox" name="question_3__useMetadata" data-metadata-toggle /></label>
            <div data-metadata-selector-container><select name="question_3__metadata"></select></div>
          </div>
        </div>
        <div class="form-group"><input name="question_4" /></div>
        <div class="form-group"><input name="question_5" /></div>
      </div>
    `;

    initializeMetadataFields(document);
    initializeQuestionFields(document);

    const question1 = document.querySelector('[name="question_1"]').parentElement;
    const question2 = document.querySelector('[name="question_2"]').parentElement;
    const question3 = document.querySelector('[name="question_3"]').parentElement;
    const questionCount = document.querySelector('[name="questions_count"]');

    expect(question1.hidden).toBe(false);
    expect(question2.hidden).toBe(false);
    expect(question3.hidden).toBe(true);

    questionCount.value = "4";
    questionCount.dispatchEvent(new Event("change"));

    expect(question3.hidden).toBe(false);
  });

  test("keeps the changed question count instead of falling back to the original default", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div>
        <input name="questions_count" value="3" />
        <div class="form-group"><input name="question_1" /></div>
        <div class="form-group"><input name="question_2" /></div>
        <div class="form-group"><input name="question_3" /></div>
        <div class="form-group"><input name="question_4" /></div>
      </div>
    `;

    initializeQuestionFields(document);

    const questionCount = document.querySelector('[name="questions_count"]');
    const question3 = document.querySelector('[name="question_3"]').closest(".form-group");
    const question4 = document.querySelector('[name="question_4"]').closest(".form-group");

    expect(question3.hidden).toBe(false);
    expect(question4.hidden).toBe(true);

    questionCount.value = "2";
    questionCount.dispatchEvent(new Event("change"));
    questionCount.value = "";
    jest.advanceTimersByTime(500);

    expect(question3.hidden).toBe(true);
    expect(question4.hidden).toBe(true);

    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("updates question visibility when the spinner value changes without a change event", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div>
        <input name="questions_count" value="3" />
        <div class="form-group"><input name="question_1" /></div>
        <div class="form-group"><input name="question_2" /></div>
        <div class="form-group"><input name="question_3" /></div>
        <div class="form-group"><input name="question_4" /></div>
      </div>
    `;

    initializeQuestionFields(document);
    jest.advanceTimersByTime(500);

    const questionCount = document.querySelector('[name="questions_count"]');
    const question3 = document.querySelector('[name="question_3"]').closest(".form-group");
    const question4 = document.querySelector('[name="question_4"]').closest(".form-group");

    expect(question3.hidden).toBe(false);
    expect(question4.hidden).toBe(true);

    questionCount.value = "2";
    jest.advanceTimersByTime(200);

    expect(question3.hidden).toBe(true);
    expect(question4.hidden).toBe(true);

    jest.useRealTimers();
  });

  test("reapplies question visibility after delayed question count restore", () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div>
        <input name="questions_count" value="0" />
        <div class="form-group"><input name="question_1" /></div>
        <div class="form-group"><input name="question_2" /></div>
        <div class="form-group"><input name="question_3" /></div>
      </div>
    `;

    initializeQuestionFields(document);

    const questionCount = document.querySelector('[name="questions_count"]');
    const question1 = document.querySelector('[name="question_1"]').closest(".form-group");
    const question2 = document.querySelector('[name="question_2"]').closest(".form-group");
    const question3 = document.querySelector('[name="question_3"]').closest(".form-group");

    expect(question1.hidden).toBe(true);
    expect(question2.hidden).toBe(true);
    expect(question3.hidden).toBe(true);

    questionCount.value = "2";
    jest.advanceTimersByTime(500);

    expect(question1.hidden).toBe(false);
    expect(question2.hidden).toBe(false);
    expect(question3.hidden).toBe(true);

    jest.clearAllTimers();
    jest.useRealTimers();
  });
});
