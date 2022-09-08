class User {
    data = {};

    constructor(dataCont) {
        if(!dataCont) return;
        if(!dataCont.name && !dataCont.email && !dataCont.address && !dataCont.phone) return; 

       this.data.name = dataCont.name;
       this.data.phone = dataCont.phone;
       this.data.email = dataCont.email;
       this.data.address = dataCont.address;
    }

    edit(dataCont){

        if(!dataCont) return;
        if(dataCont.name !== undefined && dataCont.email !== undefined && dataCont.address !== undefined && dataCont.phone !== undefined && 
            dataCont.name.length == 0 && dataCont.email.length == 0 && dataCont.address.length && dataCont.phone.length == 0) return; 

        this.data = {...this.data, ...dataCont};
    };

    get(){
        return this.data;
    };
}

class Contacts {
    lastId = 0;
    data = [];

    add(obj){
        const contact =  new User(obj);

        if(!contact || !contact.get) return;

        const contactKeys = Object.keys(contact.get());

        if(contactKeys.length == 0) return;

        this.lastId++;
        contact.id = this.lastId;

        this.data.push(contact);

    };


    edit(id,obj) {
        if(!id) return;

        const contact = this.data.find(item=>item.id != id);

        if(!contact) return;

        contact.edit(obj);
    };

    remove(id) {
        if(!id) return;

        const newData = this.data.filter(item=>item.id != id);
        
        this.data =newData;
    };

    get(id,print = false) {
        if(id>0) {
            const contact = this.data.find(item=>item.id == id);

            if(contact) {
                return print ? contact.get() : contact;
            }
        } else if(id == 0 && print) {
            this.data.forEach(item => console.log(item.get()));
            return;
        }
        return this.data;
    };


};

const myContacts = new Contacts();

class ContactsApp extends Contacts{

    data = [];
   
    concactNameInput = null;
    concactPhoneInput = null;
    concactAddressInput = null;
    concactEmailInput = null;
    contactsListElem = null;
        
    editStatus = false;
    editId = null;


    constructor(){

        super();
        const contactsListElem = null;
        this.app('root');
    };

   update = () => {
        
        this.contactsListElem.innerHTML = '';

        this.data.forEach(contact => {
            let id=contact.id;
            contact = contact.get();

            const contactElem = document.createElement('li');
            contactElem.classList.add('contact');

            const contactCloseElem = document.createElement('button');
            contactCloseElem.classList.add('contact__remove');
            contactCloseElem.innerHTML = '-';

            contactElem.innerHTML = `<h3 class="contact__name">${contact.name}</h3>`;

            contactElem.innerHTML += `<div class="contact__phone">${contact.phone}</div>`;

            contactElem.innerHTML += `<div class="contact__address">${contact.address}</div>`;

            contactElem.innerHTML += `<div class="contact__email">${contact.email}</div>`;
            
            contactElem.append(contactCloseElem);
            this.contactsListElem.append(contactElem);

            contactCloseElem.addEventListener('click', (event) => {
                this.onRemove(event, id);
            });

            contactElem.addEventListener('click', ()=>{
                this.onEdit(id);
            });

        });

        this.setStorage();
    };

    
   getCookie(name) { 
        let matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" )); 
        
        return matches ? decodeURIComponent(matches[1]) : undefined; 
    };

    setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options 
        };
    
        if (options.expires instanceof Date) { 
            options.expires = options.expires.toUTCString();
        }
         
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        for (let optionKey in options) { updatedCookie += "; " + optionKey;
         
        let optionValue = options[optionKey];
    
        if (optionValue !== true) { 
            updatedCookie += "=" + optionValue; 
        }
    }
        document.cookie = updatedCookie; 
    };

    setStorage (){
        let dataTmp = this.data.map(item =>{
            return{...{id: item.id}, ...item.get()}; 
        });

        let dataJSON = JSON.stringify(this.data);

        if(!dataJSON) return;
        localStorage.setItem('data',dataJSON);

        if (dataJSON && dataJSON != '[]') this.setCookie('dataExp', '1', { 'max-age': 86400 });

    };

     getStorage () {
        let dataTmp = localStorage.getItem('data');

        dataTmp = JSON.parse(dataTmp);

        if(!dataTmp) return;

        dataTmp.forEach(item =>{
            delete item.id;

            this.add(item);
        })
    };

    getData() {

        fetch('https://jsonplaceholder.typicode.com/')
        .then(response => {
            if (response.status == 200) return response.json();
        })
        .then(body => {
            if (body && body.length > 0) {
                let dataTmp = body.map(item => {
                    return { 
                        name: item.name,
                        phone: item.phone,
                        address: item.address,
                        email: item.email
                    };
                });

                dataTmp.forEach(item => {
                    this.add(item);
                });

                this.update();
            }
        });

    };

     onEdit = (id)=>{
        const contact = this.get(id,true);

        if(!contact) return;

        this.editId = id;

        document.querySelectorAll('.contact__form_edit').forEach(elem =>elem.remove());
        
        this.formEditElem = document.createElement('div');
        this.formEditElem.classList.add('contact__form_edit');

        this.nameEditElem = document.createElement('div');
        this.nameEditElem.classList.add('contact__form_edit_name');
        if(contact.name && contact.name.length>0) this.nameEditElem.innerHTML = contact.name;
        
        this.phoneEditElem = document.createElement('div');
        this.phoneEditElem.classList.add('contact__form_edit_phone');
        if(contact.phone && contact.phone.length>0)this.phoneEditElem.innerHTML = contact.phone; 
        

        this.addressEditElem = document.createElement('div');
        this.addressEditElem.classList.add('contact__form_edit_address');
        if(contact.address && contact.address.length>0) this.addressEditElem.innerHTML = contact.address;
       
        this.emailEditElem = document.createElement('div');
        this.emailEditElem.classList.add('contact__form_edit_email');
        if(contact.email && contact.email.length>0)this.emailEditElem.innerHTML = contact.email;
       
       

        this.formCloseElem = document.createElement('button');
        this.formCloseElem.innerHTML = '-';

        this.formEditElem.append(this.nameEditElem,this.phoneEditElem,this.addressEditElem, this.emailEditElem,this.formCloseElem);
        document.body.append(this.formEditElem);

        this.nameEditElem.contentEditable = true;
        this.phoneEditElem.contentEditable = true;
        this.addressEditElem.contentEditable = true;
        this.emailEditElem.contentEditable = true;
    

        this.nameEditElem.addEventListener('keyup',(event)=>{
            this.onSave(event,this.formEditElem,this.nameEditElem,this.addressEditElem,this.phoneEditElem,this.emailEditElem);
        });
        this.phoneEditElem.addEventListener('keyup',(event)=>{
            this.onSave(event,this.formEditElem,this.nameEditElem,this.addressEditElem,this.phoneEditElem,this.emailEditElem);
        });
        this.addressEditElem.addEventListener('keyup',(event)=>{
            this.onSave(event,this.formEditElem,this.nameEditElem,this.addressEditElem,this.phoneEditElem,this.emailEditElem);
        });
        this.emailEditElem.addEventListener('keyup',(event)=>{
            this.onSave(event,this.formEditElem,this.nameEditElem,this.addressEditElem,this.phoneEditElem,this.emailEditElem);
        });
      

        this.formCloseElem.addEventListener('click', ()=>{
            this.formEditElem.remove();
        })

    }

    onSave = (event,formElem, nameElem,phoneElem, addressElem,emailElem) => {

        if(!this.editId || event.code != 'Enter' || !event.ctrlKey)return;

        if(!formElem) return;
        
        const name = nameElem.innerHTML;
        const phone = phoneElem.innerHTML;
        const address = addressElem.innerHTML;
        const email = emailElem.innerHTML;
        
        const contact = this.get(this.editId);
        if(!contact) return;

        contact.edit({
            name: name,
            phone: phone,
            address: address,
            email: email
        });


        formElem.remove();
        this.editId = null;
        this.editStatus = true;
        this.update();
        
    }

    onRemove = (event,id) => {
       this.remove(id);
       this.update();
    }

    onAdd= (event) =>{
        if(this.editStatus || event.code != 'Enter' || !event.ctrlKey)return;

        if(!this.concactAddressInput && !this.concactEmailInput && !this.concactNameInput && !this.concactPhoneInput) return;

        const name = this.concactNameInput.value;
        const phone = this.concactPhoneInput.value;
        const email = this.concactEmailInput.value;
        const address = this.concactAddressInput.value;

        this.add({
            name: name,
            phone: phone,
            email: email,
            address:address
        });

        this.update();

        this.concactNameInput.value = '';
        this.concactPhoneInput.value = '';
        this.concactEmailInput.value = '';
        this.concactAddressInput.value = '';
    }  

    app = (idElem) => {
        this.dataExp= this.getCookie("dataExp");

        if(!this.dataExp){
            localStorage.removeItem("data");
        };

        this.getStorage();

        if(this.get().length== 0 ) this.getData();

        this.rootElem = document.querySelector('#' + idElem);

        if(!this.rootElem) return;

        this.rootElem.innerHTML = `
        <div class="contacts">
        <div class="contacts__form">
            
        </div>

        <ul class="contacts__list">

           
        </ul>
    </div>
        `;

        const contactFormElem = this.rootElem.querySelector('.contacts__form');

        this.contactsListElem = this.rootElem.querySelector('.contacts__list');

        this.concactNameInput = document.createElement('input');
        this.concactNameInput.type = 'text';
        this.concactNameInput.placeholder = 'Name';

        this.concactPhoneInput = document.createElement('input');
        this.concactPhoneInput.type = 'number';
        this.concactPhoneInput.placeholder = 'Phone';

        this.concactAddressInput = document.createElement('input');
        this.concactAddressInput.type = 'text';
        this.concactAddressInput.placeholder = 'Address';

        this.concactEmailInput = document.createElement('input');
        this.concactEmailInput.type = 'email';
        this.concactEmailInput.placeholder = 'Email';

        contactFormElem.append(this.concactNameInput,this.concactPhoneInput, this.concactAddressInput, this.concactEmailInput);

        this.concactNameInput.addEventListener('keyup', this.onAdd);
        this.concactPhoneInput.addEventListener('keyup', this.onAdd);
        this.concactEmailInput.addEventListener('keyup',this.onAdd);
        this.concactAddressInput.addEventListener('keyup', this.onAdd);

        this.update();
    };
}

new ContactsApp();
