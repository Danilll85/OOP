const elements = document.getElementsByClassName('menu-item'); // все элементы на странице, которые имеют класс 'menu-item'
for(let i = 0; i < elements.length; i++){
    elements[i].addEventListener('mousedown', showMenu); // Обработчик события. Когда происходит событие mousedown на элементе, вызывается функция showMenu
    elements[i].addEventListener('mouseleave', hideMenu);
}

function showMenu(){
    if(this.children.length > 1){ // если есть дочерние элементы то идем сюда
        this.children[1].style.height = 'auto';
        this.children[1].style.opasity = '1';
        this.children[1].style.overflow = 'visible';
    }
}

function hideMenu(){
    if(this.children.length > 1){
        this.children[1].style.height = '0';
        this.children[1].style.opasity = '0';
        this.children[1].style.overflow = 'hidden';
    }
}