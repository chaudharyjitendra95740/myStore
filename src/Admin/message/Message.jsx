import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function MessagePage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "buyProduct"),
      (snapshot) => {
        const statusMessages = snapshot.docs.map((doc) => {
          const order = doc.data();

          return {
            id: doc.id,
            type: "received",
            time: order.date || "N/A",
            text: `Order #${order.id || doc.id} status updated to ${
              order.status || "Pending"
            }`,
          };
        });

        // Latest message first
        setMessages(statusMessages.reverse());
      },
      (error) => {
        console.error("Error fetching messages:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  function clearMessages() {
    setMessages([]);
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 pt-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <i className="fa-solid fa-envelope text-blue-500"></i> Messages
        </h1>

        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg hover:cursor-pointer duration-500"
          >
            Clear All
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-gray-400">
            No Messages Found
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl shadow bg-green-100 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">
                  <i className="fa-solid fa-download text-blue-600"></i>{" "}
                  Received
                </span>

                <span className="text-sm text-gray-500">{msg.time}</span>
              </div>

              <p className="mt-2 text-gray-700">{msg.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
