export default function RequestSubmitToast() {
    return (
        <div
            className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 fixed bottom-0 right-0 m-4"
            role="alert">
            <div className="flex p-4">
                <div className="flex-shrink-0">
                    <svg className="flex-shrink-0 size-4 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg"
                         width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                </div>
                <div className="ms-3">
                    <p className="text-sm text-green-500">
                        Request successfully submitted!
                    </p>
                </div>
            </div>
        </div>
    );
}
