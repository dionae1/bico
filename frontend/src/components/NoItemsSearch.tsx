function NoItemsSearch({ query }: { query: string }) {
    return (
        <div className="text-center py-10">
            <h2 className="text-xl text-slate-700">No results found for "{query}"</h2>
        </div>
    );
}
export default NoItemsSearch;