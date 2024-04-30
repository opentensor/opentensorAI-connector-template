import React, { useState } from 'react';

const FileTao = () => {
    const [inputText, setInputText] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [retrievedData, setRetrievedData] = useState(null);
    const [cid, setCid] = useState('');
    const [hotkeys, setHotkeys] = useState([]);
    const [isLoadingStore, setIsLoadingStore] = useState(false);
    const [isLoadingRetrieve, setIsLoadingRetrieve] = useState(false);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleStoreData = async () => {
        setIsLoadingStore(true);
        try {
            const response = await fetch('https://api.hackathon.test.opentensor.ai/store/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: inputText })
            });

            if (response.ok) {
                const result = await response.json();
                setCid(result.cid);
                setHotkeys(result.hotkeys);
                setSubmitSuccess(true);
                setIsLoadingStore(false);
            } else {
                throw new Error('Failed to store data');
            }
        } catch (error) {
            console.error('Error storing data:', error);
            alert('Error storing data');
            setIsLoadingStore(false);
        }
    };

    const handleRetrieveData = async () => {
        setIsLoadingRetrieve(true);
        try {
            const response = await fetch(`https://api.hackathon.test.opentensor.ai/retrieve/?cid=${cid}&hotkeys=${hotkeys.join(',')}`, {
                method: 'GET'
            });
            if (response.ok) {
                const data = await response.json();
                setRetrievedData(data);
                setIsLoadingRetrieve(false);
            } else {
                throw new Error('Failed to retrieve data');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
            alert('Error retrieving data');
            setIsLoadingRetrieve(false);
        }
    };

    return (
        <div>
            <input type="text" value={inputText} onChange={handleInputChange} />
            <button onClick={handleStoreData} disabled={isLoadingStore}>
                {isLoadingStore ? 'Storing...' : 'Store Data'}
            </button>
            {submitSuccess && (
                <button onClick={handleRetrieveData} disabled={isLoadingRetrieve}>
                    {isLoadingRetrieve ? 'Retrieving...' : 'Retrieve Data'}
                </button>
            )}
            {retrievedData && <div><strong>Retrieved Data:</strong> {retrievedData.data}</div>}
        </div>
    );
};

export default FileTao;
