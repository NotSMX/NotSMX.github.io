let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

function updateSlides() {
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        if (index === 1) { // active slide (nth-child(2))
            item.style.backgroundImage = `url('${item.dataset.gif}')`;
        } else {
            item.style.backgroundImage = `url('${item.dataset.img}')`;
        }
    });
}

// initial update
updateSlides();

next.addEventListener('click', () => {
    const items = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(items[0]);
    updateSlides();
});

prev.addEventListener('click', () => {
    const items = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(items[items.length - 1]);
    updateSlides();
});
