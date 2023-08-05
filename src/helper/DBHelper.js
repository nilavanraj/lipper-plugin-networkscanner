// Open a connection to the IndexedDB database
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('flipperDB', 1);

    request.onerror = (event) => {
      reject('Error opening database');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('urlMethod', 'urlMethod', { unique: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};
  
  // Store data in IndexedDB
  export function storeData(database, data) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction('requests', 'readwrite');
      const objectStore = transaction.objectStore('data');
      const request = objectStore.add(data);
      request.onerror = (event) => {
        reject(Error('Failed to store data: ' + event.target.errorCode));
      };
  
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
  export const storeRequest = async (data,method) => {
    const db = await openDatabase();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('requests', 'readwrite');
      const objectStore = transaction.objectStore('requests');
      let request = null
      if(method == "add")
       request = objectStore.add(data);
      else
      request = objectStore.put(data);

  
      request.onerror = (event) => {
        console.log('Failed to store data: ' , event)

        reject('Error storing request'+ event);
      };
  
      request.onsuccess = () => {
        console.log('Request stored successfully')

        resolve('Request stored successfully');
      };
    });
  };

  export const getRequests = async () => {
    const db = await openDatabase();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('requests', 'readonly');
      const objectStore = transaction.objectStore('requests');
      const request = objectStore.getAll();
  
      request.onerror = () => {
        reject('Error retrieving requests');
      };
  
      request.onsuccess = () => {
        const requests = request.result;
        resolve(requests);
      };
    });
  };

  export const deleteDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase('flipperDB');
  
      request.onerror = (event) => {
        reject('Error deleting database');
      };
  
      request.onsuccess = (event) => {
        resolve('Database deleted successfully');
      };
    });
  };
  
  