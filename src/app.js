class User {
    data = {};

    constructor(dataCont) {
        if(!dataCont) return;
        if(!dataCont.name && !dataCont.email && !dataCont.address && !dataCont.phone) return; 

       this.data = dataCont;
    }

    edit(dataCont){

        if(!dataCont) return;
        if(dataCont.name !== undefined && dataCont.email !== undefined && dataCont.address !== undefined && dataCont.phone !== undefined && 
            dataCont.name.length == 0 && dataCont.email.length == 0 && dataCont.address.length && dataCont.phone.length == 0) return; 

        this.data = {...this.data, ...dataCont};
    }

    get(){
        return this.data;
    }
}

class Contacts {
    lastId = 0;
    data = [];

    add(obj){
        const cont =  new User(obj);
        const contKeys = Object.keys(cont.get());

        if(contKeys.length == 0) return;

        this.lastId++;
        cont.id = this.lastId;

        this.data.push(cont);

    };


    edit(id,obj) {
        if(!id) return;

        const cont = this.get(id);

        if(!cont) return;

        cont.edit(obj);
    };

    remove(id) {
        if(!id) return;

        const newData = this.data.filter(item=>item.id != id);
        
        this.data =newData;
    };

    get(id,print = false) {
        if(id>0) {
            const cont = this.data.find(item=>item.id == id);

            if(cont) {
                return print ? cont.get() : note;
            }
        } else if(id == 0 && print) {
            this.data.forEach(item =>console.log(item.get()));
            return;
        }
        return this.data;
    };


};

const contact = new Contacts();



class ContactsApp extends Contacts{
    data = [];
    concactNameInput = null;
    concactPhoneInput = null;
    concactAddressInput = null;
    concactEmailInput = null;
    contactsListElem = null;

    constructor(idElem){

        const update = () => {

            contactsListElem.innerHTML = '';

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
                contactsListElem.append(contactElem);

                contactCloseElem.addEventListener('click', () => {
                    onRemove(event, id);
                });
            });
        }

        const onRemove = (event,id) => {
           this.remove(id);
           update();
        }

      
        const onAdd = (event)=>{
            if(event.code != 'Enter' || !event.ctrlKey)return;

            if(!concactAddressInput && !concactEmailInput && !concactNameInput && !concactPhoneInput) return;

            const name = concactNameInput.value;
            const phone = concactPhoneInput.value;
            const email = concactEmailInput.value;
            const address = concactAddressInput.value;

            this.add({
                name: name,
                phone: phone,
                email: email,
                address:address
            });
            update();
            concactNameInput.value = '';
            concactPhoneInput.value = '';
            concactEmailInput.value = '';
            concactAddressInput.value = '';
        }

        
        //this.data = this.get();
        super(idElem);

        const rootElem = document.querySelector('#' + idElem);

        if(!rootElem) return;

        rootElem.innerHTML = `
        <div class="contacts">
        <div class="contacts__form">
            
        </div>

        <ul class="contacts__list">

           
        </ul>
    </div>
        `;

        const contactFormElem = rootElem.querySelector('.contacts__form');

        let contactsListElem = rootElem.querySelector('.contacts__list');

        const concactNameInput = document.createElement('input');
        concactNameInput.type = 'text';
        concactNameInput.placeholder = 'Name';

        const concactPhoneInput = document.createElement('input');
        concactPhoneInput.type = 'number';
        concactPhoneInput.placeholder = 'Phone';

        const concactAddressInput = document.createElement('input');
        concactAddressInput.type = 'text';
        concactAddressInput.placeholder = 'Address';

        const concactEmailInput = document.createElement('input');
        concactEmailInput.type = 'email';
        concactEmailInput.placeholder = 'Email';

        contactFormElem.append(concactNameInput,concactPhoneInput, concactAddressInput, concactEmailInput);

        concactNameInput.addEventListener('keyup', onAdd);
        concactPhoneInput.addEventListener('keyup', onAdd);
        concactEmailInput.addEventListener('keyup',onAdd);
        concactAddressInput.addEventListener('keyup', onAdd);
        
        update();


    }
 
}

new ContactsApp('root');
