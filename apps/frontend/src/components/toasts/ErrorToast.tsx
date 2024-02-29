export default function ErrorToast() {
    return (
        <div
            className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 fixed bottom-0 right-0 m-4"
            role="alert">
            <div className="flex p-4">
                <div className="ms-3">
                    <p className="text-sm text-red-600">
                        Error: Action could not be completed
                    </p>
                </div>
            </div>
        </div>
    );
}
