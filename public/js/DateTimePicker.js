/**
 * AlvinsTimePicker.js
 * A lightweight, customizable datetime picker component
 *
 * @author Alvin Rahul Chauhan
 * @version 1.0.0
 * @license MIT
 *
 * Features:
 * - Pure JavaScript with no dependencies
 * - Customizable min/max dates
 * - 12-hour time format with AM/PM
 * - Month/Year selection
 * - Mobile-friendly design
 * - Customizable styling
 * - Event callbacks
 *
 * Usage:
 * const picker = new DateTimePicker({
 *   minDate: new Date(),
 *   onConfirm: (date) => console.log(date)
 * });
 * picker.attach(document.querySelector('#datetime-input'));
 */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateTimePicker;
}

class DateTimePicker {
  constructor(options = {}) {
    this.options = {
      minDate: new Date(),
      maxDate: null,
      onConfirm: null,
      isRangePicker: false,
      rangeStart: null,
      rangeEnd: null,
      linkedPicker: null,
      ...options,
    };

    this.visible = false;
    const today = new Date();
    this.selectedDate = today;
    this.injectStyles();
    this.createPickerElement();
  }

  injectStyles() {
    if (!document.querySelector("#datetime-picker-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "datetime-picker-styles";
      styleSheet.textContent = `
                .datetime-picker-wrapper {
                    width: min(300px, calc(100vw - 20px));
                    border: 1px solid #e5e7eb;
                    background: white;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    position: fixed;
                    z-index: 9999;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .datetime-picker-wrapper.hidden {
                    display: none !important;
                }

                .datetime-picker-wrapper .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                    margin-bottom: 0.75rem;
                }

                .datetime-picker-wrapper .day-header {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #4b5563;
                    padding: 0.25rem 0;
                }

                .datetime-picker-wrapper .day {
                    width: 100%;
                    aspect-ratio: 1;
                    min-width: 30px;
                    min-height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                }

                .datetime-picker-wrapper .day:hover:not(:empty) {
                    background-color: #f3f4f6;
                }

                .datetime-picker-wrapper .day:empty {
                    pointer-events: none;
                }

                .datetime-picker-wrapper .day.selected {
                    background-color: #10b981;
                    color: white;
                }

                .datetime-picker-wrapper .day.selected:hover {
                    background-color: #059669;
                }

                .datetime-picker-wrapper select {
                    min-height: 36px;
                    padding: 0.25rem;
                    font-size: 0.875rem;
                }

                .datetime-picker-wrapper button {
                    min-height: 36px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.875rem;
                }

                .datetime-picker-wrapper .ok-btn {
                    background-color: #10b981;
                    color: white;
                }

                .datetime-picker-wrapper .ok-btn:hover {
                    background-color: #059669;
                }

                .datetime-picker-wrapper .cancel-btn {
                    border: 1px solid #e5e7eb;
                }

                .datetime-picker-wrapper .cancel-btn:hover {
                    background-color: #f9fafb;
                }

                .datetime-picker-wrapper .month-year {
                    font-weight: 500;
                }

                .datetime-picker-wrapper .custom-datetime-input {
                    cursor: pointer;
                    background-color: white;
                }

                .datetime-picker-wrapper .flex {
                    display: flex;
                }

                .datetime-picker-wrapper .justify-between {
                    justify-content: space-between;
                }

                .datetime-picker-wrapper .justify-center {
                    justify-content: center;
                }

                .datetime-picker-wrapper .justify-end {
                    justify-content: flex-end;
                }

                .datetime-picker-wrapper .items-center {
                    align-items: center;
                }

                .datetime-picker-wrapper .gap-2 {
                    gap: 0.5rem;
                }

                .datetime-picker-wrapper .gap-4 {
                    gap: 1rem;
                }

                .datetime-picker-wrapper .mb-4 {
                    margin-bottom: 1rem;
                }

                .datetime-picker-wrapper .self-center {
                    align-self: center;
                }

                .datetime-picker-wrapper .flex.gap-4 {
                    gap: 0.5rem;
                }

                .datetime-picker-wrapper .flex.justify-between.mb-4 {
                    margin-bottom: 0.5rem;
                }

                .datetime-picker-wrapper .time-selector {
                    position: relative;
                    z-index: 1;
                }

                .datetime-picker-wrapper .time-input-group {
                    position: relative;
                    min-width: 65px;
                }

                .datetime-picker-wrapper select {
                    width: 100%;
                    min-height: 36px;
                    padding: 0.25rem;
                    font-size: 0.875rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    background-color: white;
                    cursor: pointer;
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.5rem center;
                    background-size: 1.25rem;
                    padding-right: 2rem;
                }

                .datetime-picker-wrapper select:focus {
                    outline: none;
                    border-color: #10b981;
                    ring: 2px solid #10b981;
                }

                /* Ensure dropdowns stay within the container */
                .datetime-picker-wrapper .time-input-group select {
                    position: relative;
                    z-index: 2;
                }

                .datetime-picker-wrapper .day.disabled {
                    color: #d1d5db;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .datetime-picker-wrapper .day.disabled:hover {
                    background-color: transparent;
                }

                .datetime-picker-wrapper .month-year {
                    display: flex;
                    align-items: center;
                }

                .datetime-picker-wrapper .month-year-select {
                    border: none;
                    background: transparent;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0.25rem;
                    min-width: 140px;
                    text-align: center;
                }

                .datetime-picker-wrapper .month-year-select:focus {
                    outline: none;
                    background-color: #f3f4f6;
                    border-radius: 0.25rem;
                }

                .datetime-picker-wrapper .month-year-button {
                    border: none;
                    background: transparent;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                }

                .datetime-picker-wrapper .month-year-button:hover {
                    background-color: #f3f4f6;
                }

                .datetime-picker-wrapper .month-selector {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    z-index: 3;
                }

                .datetime-picker-wrapper .year-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .datetime-picker-wrapper .current-year {
                    font-weight: 500;
                }

                .datetime-picker-wrapper .months-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .datetime-picker-wrapper .month-option {
                    padding: 0.5rem;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.25rem;
                    background: white;
                    cursor: pointer;
                }

                .datetime-picker-wrapper .month-option:hover:not(.disabled) {
                    background-color: #f3f4f6;
                }

                .datetime-picker-wrapper .month-option.selected {
                    background-color: #10b981;
                    color: white;
                    border-color: #10b981;
                }

                .datetime-picker-wrapper .month-option.disabled {
                    color: #d1d5db;
                    cursor: not-allowed;
                    background-color: #f9fafb;
                }

                .datetime-picker-wrapper .close-month-selector {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.25rem;
                    background: white;
                    cursor: pointer;
                }

                .datetime-picker-wrapper .close-month-selector:hover {
                    background-color: #f3f4f6;
                }

                .datetime-picker-wrapper .day.range-start {
                    background-color: #10b981;
                    color: white;
                    border-radius: 9999px 0 0 9999px;
                }

                .datetime-picker-wrapper .day.range-end {
                    background-color: #10b981;
                    color: white;
                    border-radius: 0 9999px 9999px 0;
                }

                .datetime-picker-wrapper .day.in-range {
                    background-color: #d1fae5;
                    border-radius: 0;
                }

                .datetime-picker-wrapper .day.range-start.range-end {
                    border-radius: 9999px;
                }

                .datetime-picker-wrapper .day.in-range:hover {
                    background-color: #a7f3d0;
                }

                .datetime-picker-wrapper select {
                    border: 1px solid #e5e7eb;
                }
                .datetime-picker-wrapper select:required:invalid {
                    color: #6b7280;
                }
                .datetime-picker-wrapper option[value=""][disabled] {
                    display: none;
                }
                .datetime-picker-wrapper option {
                    color: #000;
                }
            `;
      document.head.appendChild(styleSheet);
    }
  }

  createPickerElement() {
    this.element = document.createElement("div");
    this.element.className = "datetime-picker-wrapper hidden";
    this.element.innerHTML = `
            <div class="flex justify-between mb-4">
                <button class="prev-month">←</button>
                <div class="month-year">
                    <button class="month-year-button"></button>
                </div>
                <button class="next-month">→</button>
            </div>
            <div class="month-selector hidden">
                <div class="year-navigation">
                    <button class="prev-year">←</button>
                    <span class="current-year"></span>
                    <button class="next-year">→</button>
                </div>
                <div class="months-grid">
                    ${Array.from(
                      { length: 12 },
                      (_, i) =>
                        `<button class="month-option" data-month="${i}"></button>`
                    ).join("")}
                </div>
                <button class="close-month-selector">Cancel</button>
            </div>
            <div class="calendar-grid">
                <div class="day-header">Su</div>
                <div class="day-header">Mo</div>
                <div class="day-header">Tu</div>
                <div class="day-header">We</div>
                <div class="day-header">Th</div>
                <div class="day-header">Fr</div>
                <div class="day-header">Sa</div>
            </div>
            <div class="flex gap-4 justify-center mb-4 time-selector">
                <div class="time-input-group">
                    <select class="hours" required>
                        <option value="" disabled selected>HH</option>
                        ${Array.from(
                          { length: 12 },
                          (_, i) =>
                            `<option value="${i + 1}">${(i + 1)
                              .toString()
                              .padStart(2, "0")}</option>`
                        ).join("")}
                    </select>
                </div>
                <span class="self-center">:</span>
                <div class="time-input-group">
                    <select class="minutes" required>
                        <option value="" disabled selected>MM</option>
                        ${Array.from(
                          { length: 60 },
                          (_, i) =>
                            `<option value="${i
                              .toString()
                              .padStart(2, "0")}">${i
                              .toString()
                              .padStart(2, "0")}</option>`
                        ).join("")}
                    </select>
                </div>
                <div class="time-input-group">
                    <select class="ampm">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <button class="cancel-btn">Cancel</button>
                <button class="ok-btn">OK</button>
            </div>
        `;

    document.body.appendChild(this.element);
    this.addEventListeners();
  }

  addEventListeners() {
    this.element
      .querySelector(".prev-month")
      .addEventListener("click", () => this.previousMonth());
    this.element
      .querySelector(".next-month")
      .addEventListener("click", () => this.nextMonth());
    this.element
      .querySelector(".ok-btn")
      .addEventListener("click", () => this.confirm());
    this.element
      .querySelector(".cancel-btn")
      .addEventListener("click", () => this.hide());

    this.element.querySelector(".hours").addEventListener("change", (e) => {
      let hours = parseInt(e.target.value);
      const ampm = this.element.querySelector(".ampm").value;
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      this.selectedDate.setHours(hours);
    });

    this.element.querySelector(".ampm").addEventListener("change", (e) => {
      let hours = parseInt(this.element.querySelector(".hours").value);
      const ampm = e.target.value;
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      this.selectedDate.setHours(hours);
    });

    this.element.querySelector(".minutes").addEventListener("change", (e) => {
      this.selectedDate.setMinutes(parseInt(e.target.value));
    });

    // Close picker when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.visible &&
        !this.element.contains(e.target) &&
        !this.input.contains(e.target) &&
        !e.target.closest(".datetime-picker-wrapper")
      ) {
        this.hide();
      }
    });

    const monthYearButton = this.element.querySelector(".month-year-button");
    const monthSelector = this.element.querySelector(".month-selector");
    const monthsGrid = this.element.querySelector(".months-grid");
    const closeSelector = this.element.querySelector(".close-month-selector");

    monthYearButton.addEventListener("click", () => {
      monthSelector.classList.remove("hidden");
      this.updateMonthSelector();
    });

    closeSelector.addEventListener("click", () => {
      monthSelector.classList.add("hidden");
    });

    this.element.querySelector(".prev-year").addEventListener("click", () => {
      const currentYear = parseInt(
        this.element.querySelector(".current-year").textContent
      );
      if (currentYear > new Date().getFullYear()) {
        this.updateMonthSelector(currentYear - 1);
      }
    });

    this.element.querySelector(".next-year").addEventListener("click", () => {
      const currentYear = parseInt(
        this.element.querySelector(".current-year").textContent
      );
      this.updateMonthSelector(currentYear + 1);
    });

    monthsGrid.addEventListener("click", (e) => {
      const monthButton = e.target.closest(".month-option");
      if (!monthButton) return;

      const month = parseInt(monthButton.dataset.month);
      const year = parseInt(
        this.element.querySelector(".current-year").textContent
      );
      const newDate = new Date(this.selectedDate);
      newDate.setFullYear(year);
      newDate.setMonth(month);

      const today = new Date();
      if (
        newDate.getFullYear() > today.getFullYear() ||
        (newDate.getFullYear() === today.getFullYear() &&
          newDate.getMonth() >= today.getMonth())
      ) {
        this.selectedDate = newDate;
        this.updateUI();
        monthSelector.classList.add("hidden");
      }
    });

    const timeInputs = this.element.querySelectorAll(
      ".time-input-group select"
    );
    timeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        input.style.borderColor = "#e5e7eb";
      });
    });
  }

  attach(input) {
    this.input = input;
    this.input.addEventListener("click", (e) => {
      e.preventDefault();
      this.show();
    });
    this.input.addEventListener("focus", (e) => {
      e.preventDefault();
      this.show();
    });

    // Parse initial value if exists
    if (this.input.value) {
      const date = new Date(this.input.value);
      if (!isNaN(date)) {
        this.selectedDate = date;
      }
    }
  }

  show() {
    this.visible = true;
    this.element.classList.remove("hidden");
    this.updateUI();

    // Position the picker with better mobile handling
    const inputRect = this.input.getBoundingClientRect();
    const pickerHeight = this.element.offsetHeight;
    const windowHeight = window.innerHeight;

    // Check if there's room below the input
    const spaceBelow = windowHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    this.element.style.position = "fixed";

    // Calculate left position with bounds checking
    let leftPos = Math.max(10, inputRect.left);
    leftPos = Math.min(
      leftPos,
      window.innerWidth - this.element.offsetWidth - 10
    );
    this.element.style.left = `${leftPos}px`;

    // Decide whether to show above or below input
    if (spaceBelow >= pickerHeight || spaceBelow > spaceAbove) {
      // Show below
      this.element.style.top = `${inputRect.bottom + 5}px`;
      this.element.style.bottom = "auto";
    } else {
      // Show above
      this.element.style.bottom = `${windowHeight - inputRect.top + 5}px`;
      this.element.style.top = "auto";
    }
  }

  hide() {
    this.visible = false;
    this.element.classList.add("hidden");
  }

  updateUI() {
    this.updateMonthYear();
    this.updateCalendarGrid();
    this.updateTime();
  }

  updateMonthYear() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthYearButton = this.element.querySelector(".month-year-button");
    monthYearButton.textContent = `${
      months[this.selectedDate.getMonth()]
    } ${this.selectedDate.getFullYear()}`;
  }

  updateCalendarGrid() {
    const grid = this.element.querySelector(".calendar-grid");
    const daysContainer = grid.querySelectorAll(".day");
    daysContainer.forEach((day) => day.remove());

    const firstDay = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      0
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      this.addDayToGrid(grid, "");
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.addDayToGrid(grid, day);
    }
  }

  addDayToGrid(grid, day) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";

    if (day !== "") {
      const currentDate = new Date(this.selectedDate);
      currentDate.setDate(day);
      currentDate.setHours(0, 0, 0, 0);

      const minDate = new Date(this.options.minDate);
      minDate.setHours(0, 0, 0, 0);

      // Add maxDate validation
      const maxDate = this.options.maxDate ? new Date(this.options.maxDate) : null;
      if (maxDate) maxDate.setHours(0, 0, 0, 0);

      // Add range styling
      if (this.options.isRangePicker && this.options.linkedPicker) {
        const rangeStart = this.options.linkedPicker.selectedDate;
        const rangeEnd = this.selectedDate;

        if (rangeStart && rangeEnd) {
          rangeStart.setHours(0, 0, 0, 0);
          rangeEnd.setHours(0, 0, 0, 0);
          currentDate.setHours(0, 0, 0, 0);

          // Style range start
          if (currentDate.getTime() === rangeStart.getTime()) {
            dayElement.classList.add("range-start");
          }

          // Style range end
          if (currentDate.getTime() === rangeEnd.getTime()) {
            dayElement.classList.add("range-end");
          }

          // Style days in between
          if (currentDate > rangeStart && currentDate < rangeEnd) {
            dayElement.classList.add("in-range");
          }
        }
      }

      if (currentDate < minDate || (maxDate && currentDate > maxDate)) {
        dayElement.classList.add("disabled");
      } else {
        if (day === this.selectedDate.getDate()) {
          dayElement.classList.add("selected");
        }

        dayElement.addEventListener("click", (e) => {
          e.stopPropagation();
          grid
            .querySelectorAll(".day")
            .forEach((d) => d.classList.remove("selected"));
          dayElement.classList.add("selected");

          const newDate = new Date(this.selectedDate);
          newDate.setDate(day);
          this.selectedDate = newDate;

          // Update range if this is a range picker
          if (this.options.isRangePicker) {
            this.options.rangeStart = this.selectedDate;
            if (this.options.linkedPicker) {
              this.options.linkedPicker.updateUI();
            }
          }

          this.updateUI();
        });
      }
    }

    dayElement.textContent = day;
    grid.appendChild(dayElement);
  }

  updateTime() {
    const hoursSelect = this.element.querySelector(".hours");
    const minutesSelect = this.element.querySelector(".minutes");
    const ampmSelect = this.element.querySelector(".ampm");

    // Set placeholders
    hoursSelect.setAttribute("placeholder", "HH");
    minutesSelect.setAttribute("placeholder", "MM");

    // Only set values if the input has a value (a date was previously selected)
    if (this.input.value) {
      const [datePart, timePart, ampm] = this.input.value.split(" ");
      const [hours, minutes] = timePart.split(":");

      // Convert to 24-hour format
      let hour = parseInt(hours);
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;

      // Update selectedDate with correct time
      this.selectedDate.setHours(hour);
      this.selectedDate.setMinutes(parseInt(minutes));

      // Set the values in the selects
      let displayHours = hour % 12;
      displayHours = displayHours === 0 ? 12 : displayHours;

      hoursSelect.value = displayHours;
      minutesSelect.value = minutes.toString().padStart(2, "0");
      ampmSelect.value = ampm;
    } else {
      // Show empty values with placeholders for new selection
      hoursSelect.value = "";
      minutesSelect.value = "";
      ampmSelect.value = "AM";
    }
  }

  previousMonth() {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);

    const minDate = new Date(this.options.minDate);
    minDate.setDate(1); // Compare with start of month

    if (newDate >= minDate) {
      this.selectedDate = newDate;
      this.updateUI();
    }
  }

  nextMonth() {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);

    // Add maxDate validation
    if (!this.options.maxDate || newDate <= this.options.maxDate) {
        this.selectedDate = newDate;
        this.updateUI();
    }
  }

  confirm() {
    const hoursSelect = this.element.querySelector(".hours");
    const minutesSelect = this.element.querySelector(".minutes");
    const ampmSelect = this.element.querySelector(".ampm");

    // Validate time selections
    if (!hoursSelect.value || !minutesSelect.value) {
      if (!hoursSelect.value) {
        hoursSelect.style.borderColor = "#ef4444";
      }
      if (!minutesSelect.value) {
        minutesSelect.style.borderColor = "#ef4444";
      }
      return;
    }

    let hours = parseInt(hoursSelect.value);
    const minutes = parseInt(minutesSelect.value);
    const ampm = ampmSelect.value;

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    this.selectedDate.setHours(hours, minutes);
    this.input.value = this.formatDate(this.selectedDate);

    const event = new Event("change", { bubbles: true });
    this.input.dispatchEvent(event);

    if (this.options.onConfirm) {
      this.options.onConfirm(this.selectedDate);
    }

    this.hide();
  }

  formatDate(date) {
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${hours
      .toString()
      .padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${ampm}`;
  }

  updateMonthSelector(year = this.selectedDate.getFullYear()) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.element.querySelector(".current-year").textContent = year;

    const minDate = new Date(this.options.minDate);
    const maxDate = this.options.maxDate ? new Date(this.options.maxDate) : null;
    const monthButtons = this.element.querySelectorAll(".month-option");

    monthButtons.forEach((button, index) => {
      button.textContent = months[index];

      const isBeforeMin = (year === minDate.getFullYear() && index < minDate.getMonth()) || year < minDate.getFullYear();
      const isAfterMax = maxDate && ((year === maxDate.getFullYear() && index > maxDate.getMonth()) || year > maxDate.getFullYear());

      if (isBeforeMin || isAfterMax) {
        button.classList.add("disabled");
      } else {
        button.classList.remove("disabled");
      }

      if (
        year === this.selectedDate.getFullYear() &&
        index === this.selectedDate.getMonth()
      ) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }

  setMinDate(date) {
    this.options.minDate = new Date(date);

    if (this.selectedDate < this.options.minDate) {
      this.selectedDate = new Date(this.options.minDate);
    }

    if (this.visible) {
      this.updateUI();
    }
  }
}

if (typeof window !== 'undefined') {
    window.DateTimePicker = DateTimePicker;
}