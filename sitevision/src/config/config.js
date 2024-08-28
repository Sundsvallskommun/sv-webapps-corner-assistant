$(function () {
  $('[data-toggle="collapse"]').each((i, el) => {
    const target = $(el).attr("data-target");
    const closed = $(el).hasClass("collapsed");

    $(el).attr("aria-controls", target?.replace("#", ""));
    $(el).attr("aria-expanded", !closed);
    $(target).attr("aria-expanded", !closed);

    const targetClosed = $(target).hasClass("collapse");

    if (targetClosed !== closed) {
      if (closed) {
        $(target).addClass("collapse");
      } else {
        $(target).removeClass("collapse");
      }
    }
  });

  function togglePanel(button) {
    const target = $(button).attr("data-target");
    const closed = $(target).hasClass("collapse");
    if (closed) {
      $(target).removeClass("collapse");
      $(button).removeClass("collapsed");
      $(target).attr("aria-expanded", "true");
      $(button).attr("aria-expanded", "true");
    } else {
      $(target).addClass("collapse");
      $(button).addClass("collapsed");
      $(target).attr("aria-expanded", "false");
      $(button).attr("aria-expanded", "false");
    }
  }

  $('[data-toggle="collapse"]').on("click", (event) => {
    const button = event.currentTarget;
    const closed = $(button).hasClass("collapsed");
    const parent = $(button).attr("data-parent");

    if (parent && $(parent)?.is("[data-accordion]") && closed) {
      $(`${parent} [data-toggle="collapse"]`).each((i, sibling) => {
        if (sibling !== button) {
          const siblingClosed = $(sibling).hasClass("collapsed");
          if (!siblingClosed) {
            togglePanel(sibling);
          }
        }
      });
    }

    togglePanel(button);
  });

  const initialNumberOfEvents = parseInt(
    $('input[name="questions_count"]').attr("value")
  );

  for (let index = 0; index < 5; index++) {
    const show = index < initialNumberOfEvents;

    $(`input[name="question_${index + 1}"]`)
      .parent()
      .attr("style", `display: ${show ? "block" : "none"}`);
  }

  $('input[name="questions_count"]').on("change", (event) => {
    const numberOfEvents = parseInt(event.target.value);

    for (let index = 0; index < 5; index++) {
      const show = index < numberOfEvents;

      $(`input[name="question_${index + 1}"]`)
        .parent()
        .attr("style", `display: ${show ? "block" : "none"}`);
    }
  });
});
