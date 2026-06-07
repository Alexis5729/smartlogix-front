function PageContainer({ children }) {
    return (
        <div className="max-w-[1700px] mx-auto px-6 py-6">
            {children}
        </div>
    );
}

export default PageContainer;