class List {
    constructor(name) {
        this.name = name;
        this.books = [];
    }

    addBook(name, pages) {
        this.books.push(new this.books(name, pages));
    }
}

class Book {
    constructor(name, pages) {
        this.name = name;
        this.pages = pages;
    }
}

class ListService {
    static url = 'https://myreadinglists.free.beeceptor.com';

    static getAllLists() {
        return $.get(this.url);
    }

    static getList(id) {
        return $.get(this.url + `/${id}`);
    }

    static createList(list) {
        return $.post(this.url, list);
    }

    static UpdateList(list) {
        return $.ajax({
            url: this.url + `/${list._id}`,
            dataType: 'json',
            data: JSON.stringify(list),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteList(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static lists;

    static getAllLists() {
        ListService.getAllLists().then(lists => this.render(lists));
    }

    static createList(name) {
        ListService.createList( new List(name))
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }

    static deleteList(id) {
        ListService.deleteList(id)
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }

    static addBook(id) {
        for (let list of this.lists) {
            if (list._id == id) {
                list.books.push(new Book($(`#${list._id}-book-name`).val(), $(`#${list._id}-book-pages`).val()));
                ListService.UpdateList(list)
                .then(() => {
                    return ListService.getAllLists();
                })
                .then((lists) => this.render(lists));
            }
        }
    }

    static deleteBook(listId, bookId) {
        for (let list of this.lists) {
            if (list._id == listId) {
                for (let book of list.books) {
                    if (book._id == bookId) {
                        list.books.splice(list.books.indexOf(book), 1);
                        ListService.ipdateList(list)
                        .then(() => {
                            return ListService.getAllLists();
                        })
                        .then((lists) => this.render(lists));
                    }
                }
            }
        }
    }

    static render(lists) {
        this.lists = lists;
        $('#app').empty();
        for (let list of lists) {
            $('#app').prepend(
                `<div id="${list._id}" class="card">
                <div class="card-header">
                <h2>${list.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteList('${list._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${list._id}-book-name" class="form-control" placeholder="Book Name/Author">
                            </div>
                            <div class="col-sm">
                            <input type="text" id="${list._id}-book-pages" class="form-control" placeholder="Pages">
                            </div>
                            </div>
                            <button id=${list._id}-new-book" onclick="DOMManager.addBook('${list._id}')" class ="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div> <br>`
            );
            for (let book of list.books) {
                $(`#${list._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${book._id}"><strong>Name: </strong> ${book.name}</span>
                    <span id="pages-${book._id}"><strong>Pages: </strong> ${book.pages}</span>
                    <button class ="btn btn-danger" onclick="DOMManager.deleteBook('${list._id}', '${book._id}')">Delete Book</button>
                    </p>`
                );
            }
        }
    }
}

$('#create-new-list').click(() => {
    DOMManager.createList($('#new-list-name').val());
    $('#new-list-name').val('');
});

DOMManager.getAllLists();