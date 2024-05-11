import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Searchbar = () => {
	return (
		<div className="searchbar mt-4">
			<div className="flex flex-row">
				<MagnifyingGlassIcon className="size-6 sm:size-12" />
				<input type="text" className="ml-3" placeholder="Search" />
			</div>
		</div>
	);
};

export default Searchbar;
