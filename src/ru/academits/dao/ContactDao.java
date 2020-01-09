package ru.academits.dao;

import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Created by Anna on 17.06.2017.
 */
public class ContactDao {
    private List<Contact> contactList = new ArrayList<>();
    private AtomicInteger idSequence = new AtomicInteger(0);

    public ContactDao() {
        Contact contact = new Contact();
        contact.setId(getNewId());
        contact.setFirstName("Иван");
        contact.setLastName("Иванов");
        contact.setPhone("9123456789");
        contactList.add(contact);
    }

    private int getNewId() {
        return idSequence.addAndGet(1);
    }

    public List<Contact> getAllContacts() {
        return contactList;
    }

    public void add(Contact contact) {
        contact.setId(getNewId());
        contactList.add(contact);
    }

    public void delete(Contact contact) {
        contactList.removeIf(contact1 -> contact.getId() == contact1.getId());
    }

    public List<Contact> getFilteredContacts(String term) {
        return contactList.stream().filter(item -> {
            String contactString = item.getPhone() + item.getFirstName() + item.getLastName();
            contactString = contactString.toUpperCase();
            return contactString.contains(term.toUpperCase());
        }).collect(Collectors.toList());
    }
}
