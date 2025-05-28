# Automate Accounts Receipt OCR

A Node.js web application for automating the extraction of key details from scanned PDF receipts using OCR, storing the results in a structured SQLite database.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **ghostscript** (required for PDF to image conversion)

### Install ghostscript for pdf to image conversiona as pdf contains text data
- [ ] We can further enhance performance by checking if the current PDF contains text data. If it does, we can extract the text without using OCR. If the data is in image format within the PDF, we can convert it to text using OCR.

```sudo pacman -S ghostscript```

---

## Project Setup

1. **Clone or download the project:**

```git clone```

2. **Install Node.js dependencies:**

```npm i``` 

3. **Install pdf2pic for PDF to image conversion:**

```npm install pdf2pic```

4. **(Optional) Install nodemon for development:**

```npm install --save-dev nodemon```

---

## Running the Application

Start the server:

```npm start```


The server will run by default at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

- `POST /api/upload` - Upload a scanned PDF receipt.
- `POST /api/validate` - Validate an uploaded receipt file.
- `POST /api/process` - Extract receipt details using OCR.
- `GET /api/receipts` - List all processed receipts.
- `GET /api/receipts/:id` - Get details of a specific receipt.

---

## Notes

- All uploaded files are stored in the `uploads/` directory.
- The SQLite database is stored at `database/receipts.db`.
- Make sure `ghostscript` is installed for PDF to image conversion.
- For best OCR results, use high-quality scanned PDFs.

---

# Automate Accounts Receipt API
tested using
```https://github.com/automateaccounts/automate-accounts-developer-hiring-assessment/blob/main/2023/wynn_20231209_014.pdf```
## Endpoints

1. **Check Server Status**
   - **URL:** `http://localhost:3000`
   - **Description:** Checks if the server is running.
   - **Response:** `Automate Accounts Receipt API is running!`

2. **Upload Receipt File**
   - **URL:** `http://localhost:3000/api/upload`
   - **Description:** Uploads a receipt file.
   - **Request:**
     ```bash
     curl --location 'http://localhost:3000/api/upload' \
     --form 'receipt=@"path/to/your/receipt.pdf"'
     ```
   - **Response:** 
     ```json
     {
         "message": "File uploaded.",
         "id": 1
     }
     ```

3. **Validate Uploaded File**
   - **URL:** `http://localhost:3000/api/validate`
   - **Description:** Validates the uploaded receipt file.
   - **Request:**
     ```bash
     curl --location 'http://localhost:3000/api/validate' \
     --header 'Content-Type: application/json' \
     --data '{
         "id": 1
     }'
     ```
   - **Response:** 
     ```json
     {
         "message": "PDF is valid."
     }
     ```

4. **Process Uploaded File**
   - **URL:** `http://localhost:3000/api/process`
   - **Description:** Processes the uploaded receipt file.
   - **Request:**
     ```bash
     curl --location 'http://localhost:3000/api/process' \
     --header 'Content-Type: application/json' \
     --data '{
         "id": 1
     }'
     ```
   - **Response:** 
     ```json
     {
         "message": "Receipt processed with OCR.",
         "receipt": {
             "id": 1,
             "merchant_name": null,
             "total_amount": 371.25,
             "purchased_at": null,
             "file_path": "path/to/your/receipt.pdf",
             "created_at": "2025-05-28T16:26:35.684Z",
             "updated_at": "2025-05-28T16:26:35.684Z"
         },
         "ocrText": "Extracted text from the receipt..."
     }
     ```

5. **Get All Uploaded Receipts**
   - **URL:** `http://localhost:3000/api/receipts`
   - **Description:** Retrieves a list of all uploaded receipts.
   - **Response:** 
     ```json
     [
         {
             "id": 1,
             "purchased_at": null,
             "merchant_name": null,
             "total_amount": 371.25,
             "file_path": "path/to/your/receipt.pdf",
             "created_at": "2025-05-28T16:26:35.684Z",
             "updated_at": "2025-05-28T16:26:35.684Z"
         }
     ]
     ```

6. **Get Receipt Details**
   - **URL:** `http://localhost:3000/api/receipts/1`
   - **Description:** Retrieves details of a specific receipt by ID.
   - **Response:** 
     ```json
     {
         "id": 1,
         "purchased_at": null,
         "merchant_name": null,
         "total_amount": 371.25,
         "file_path": "path/to/your/receipt.pdf",
         "created_at": "2025-05-28T16:26:35.684Z",
         "updated_at": "2025-05-28T16:26:35.684Z"
     }
     ```