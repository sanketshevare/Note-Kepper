import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { BsFillPinAngleFill } from 'react-icons/bs';
import { RiDeleteBinFill } from 'react-icons/ri';
import { firestore } from "../config/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function PaginatedItems({ itemsPerPage }) {
  const [note, setNote] = useState([]);
  const [fetching, setFetching] = useState(true); // Flag to control initial fetching

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = note.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(note.length / itemsPerPage);

  // Pin to top
  const [pinned, setPinned] = useState([]);

  const pin = (itemId) => {
    if (pinned.includes(itemId)) {
      setPinned((prev) => prev.filter((id) => id !== itemId));
    } else {
      setPinned((prev) => [...prev, itemId]);
    }
  };

  // Fetch notes from Firestore

  const getNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "notes"));
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setNote(newData);
      console.log(newData);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    getNotes();
    setFetching(false);
  }, [fetching]);

    // Delete functionality

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(collection(firestore, "notes"), id));
      // Fetch the updated list of notes after deletion
      getNotes();
    } catch (error) {
      console.log("Error deleting document: ", error);
    }
  };

  // Edit functionality 
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const startEditing = (itemId, title, body) => {
    setEditingItemId(itemId);
    setEditedTitle(title);
    setEditedBody(body);
  };



  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(collection(firestore, "notes"), id), {
        title: editedTitle,
        body: editedBody,
      });
      // Fetch the updated list of notes after saving the edits
      getNotes();
      // Clear the edit state
      setEditingItemId(null);
      setEditedTitle('');
      setEditedBody('');
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  const handleCancelEdit = () => {
    // Clear the edit state
    setEditingItemId(null);
    setEditedTitle('');
    setEditedBody('');
  };

  return (
    <div className='flex flex-col'>
      <div className='grid md:grid-cols-3'>
        {currentItems.sort((a, b) => (pinned.includes(a.id) ? -1 : pinned.includes(b.id) ? 1 : 0)).map((item) => (
          <div key={item.id}>
            <div className={`bg-blue-400 m-5 rounded-lg shadow-lg ${editingItemId === item.id ? 'border-2 border-blue-500' : ''}`}>
              <BsFillPinAngleFill
                className={`text-4xl ${pinned.includes(item.id) ? 'text-green-900' : 'text-red-600'} m-1 cursor-pointer`}
                onClick={() => pin(item.id)}
              />
              <p className='text-right m-1'>{item.createdAt}</p>
              {editingItemId === item.id ? (
                <>
                  <input
                    className="text-xl uppercase bg-transparent outline-none"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <div className='h-px bg-slate-600 w-full'></div>
                  <textarea
                    className="p-2 bg-transparent outline-none"
                    rows={4}
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                  />
                  <div className='grid grid-cols-2 justyfy-items-center'>
                    <button className="p-3 bg-blue-500" onClick={() => handleSaveEdit(item.id)}>
                      Save
                    </button>
                    <button className="p-3 bg-red-500" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <center>
                    <p className='text-xl uppercase'>{item.title}</p>
                  </center>
                  <div className='h-px bg-slate-600 w-full'></div>

                  <div className='flex'>
                   {item.tag? <p className='p-1 bg-sky-800 rounded-xl text-xs text-white m-1  uppercase '>{item.tag}</p> : null}
                  </div>
                  <div className='p-24'>
                    <p>{item.body}</p>
                  </div>
                  <div className='grid grid-cols-2 justyfy-items-center'>
                    <button className='p-3 bg-blue-500' onClick={() => startEditing(item.id, item.title, item.body)}>
                      Edit
                    </button>
                    <button className='p-3 bg-red-500 align-center' onClick={() => handleDelete(item.id)}>
                      <center>
                        <RiDeleteBinFill className='' />
                      </center>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className=''>
        <ReactPaginate
          className='flex flex-row m-5 justify-center'
          breakLabel='...'
          nextLabel='>'
          onPageChange={(event) => {
            const newOffset = (event.selected * itemsPerPage) % note.length;
            setItemOffset(newOffset);
          }}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel='<'
          renderOnZeroPageCount={null}
          previousClassName="mr-6 text-fuchsia-400"
          nextClassName="ml-6 text-fuchsia-400"
          pageLinkClassName="m-5 text-white"
          activeClassName='bg-blue-500 text-yellow-400 rounded-2xl p-1 font-bold'
          disabledClassName='text-gray-700'
        />
      </div>
    </div>
  );
}
