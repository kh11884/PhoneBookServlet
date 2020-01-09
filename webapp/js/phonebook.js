function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.checked = false;
    this.shown = true;
}

new Vue({
    el: "#app",
    data: {
        validation: false,
        serverValidation: false,
        firstName: "",
        lastName: "",
        phone: "",
        rows: [],
        serverError: "",
        term: ""
    },
    methods: {
        contactToString: function (contact) {
            var note = "(";
            note += contact.firstName + ", ";
            note += contact.lastName + ", ";
            note += contact.phone;
            note += ")";
            return note;
        },
        convertContactList: function (contactListFromServer) {
            return contactListFromServer.map(function (contact, i) {
                return {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    checked: false,
                    shown: true,
                    number: i + 1
                };
            });
        },
        addContact: function () {
            if (this.hasError) {
                this.validation = true;
                this.serverValidation = false;
                return;
            }

            var self = this;

            var contact = new Contact(this.firstName, this.lastName, this.phone);
            $.ajax({
                type: "POST",
                url: "/phonebook/add",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });

            self.firstName = "";
            self.lastName = "";
            self.phone = "";
            self.validation = false;
        },
        deleteContact: function(contact){
            var self = this;

            $.ajax({
                type: "POST",
                url: "/phonebook/delete",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });
        },
        loadData: function () {
            var self = this;

            $.get("/phonebook/get/all").done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            });
        },
        loadFilteredContacts: function (term) {
            if(!term){
                return;
            }
            var self = this;

            $.ajax({
                type: "POST",
                url: "/phonebook/filtered",
                data: term
            }).done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            });
        },
        cancelFilteredContacts: function () {
            this.term = "";
            this.loadData();
        }
    },
    computed: {
        firstNameError: function () {
            if (this.firstName) {
                return {
                    message: "",
                    error: false
                };
            }

            return {
                message: "CLIENT: Поле Имя должно быть заполнено.",
                error: true
            };
        },
        lastNameError: function () {
            if (!this.lastName) {
                return {
                    message: "CLIENT: Поле Фамилия должно быть заполнено.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        phoneError: function () {
            if (!this.phone) {
                return {
                    message: "Поле CLIENT Телефон должно быть заполнено.",
                    error: true
                };
            }

            var self = this;

            var sameContact = this.rows.some(function (c) {
                return c.phone === self.phone;
            });

            if (sameContact) {
                return {
                    message: "CLIENT: Номер телефона не должен дублировать другие номера в телефонной книге.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        hasError: function () {
            return this.lastNameError.error || this.firstNameError.error || this.phoneError.error;
        }
    },
    created: function () {
        this.loadData();
    }
});

