//react
import React, { useContext, useState, useEffect } from 'react';
//firebase
import { db } from '../firebase-config';
import { ref, push, onValue, remove } from 'firebase/database';

const DatabaseContext = React.createContext();

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {

    //states
    const [loading, setLoading] = useState(true);

    function deleteItem(id, url) {
        const dbref = ref(db, `${url}/${id}`);
        remove(dbref);
    }

    async function get(url) {
        const dbref = ref(db, url);
        const fromDB = [];
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
        });
        return fromDB;
    }

    useEffect(() => {
        setLoading(false);
    }, [])

    //expose / export functions to others to see
    const value = {
        deleteItem,
        get
    }
    return (
        <DatabaseContext.Provider value={value}>
            {!loading && children}
        </DatabaseContext.Provider>
    )
}
