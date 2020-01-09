package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.coverter.ContactConverter;
import ru.academits.model.Contact;
import ru.academits.service.ContactService;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.List;

public class GetFilteredContactsServlet extends HttpServlet {
    private ContactService phoneBookService = PhoneBook.phoneBookService;
    private ContactConverter contactConverter = PhoneBook.contactConverter;

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        try (OutputStream responseStream = resp.getOutputStream()) {
            String term = req.getReader().readLine();
            List<Contact> filteredContactList = phoneBookService.getFilteredContacts(term);
            String filteredContactListJson = contactConverter.convertToJson(filteredContactList);
            responseStream.write(filteredContactListJson.getBytes(Charset.forName("UTF-8")));
        } catch (Exception e) {
            System.out.println("error in GetFilteredContactsServlet GET: ");
            e.printStackTrace();
        }
    }
}
