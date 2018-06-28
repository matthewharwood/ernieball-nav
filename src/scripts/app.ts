
const dropdown = document.querySelector('[data-lang-dropdown]') as HTMLElement;

const dropdownList = document.querySelector('[data-lang-dropdown-list]') as HTMLElement;
dropdown.addEventListener('click', (e) => {
    dropdownList.classList.toggle('lang-select__dropdown--active');
});
