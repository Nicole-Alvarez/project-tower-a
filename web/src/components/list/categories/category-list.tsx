export const CategoryListCheckbox = ({
    category,
    selectedCategories,
    handleSelectCategory,
    index,
}: any) => {
    const isSelected = selectedCategories.includes(category.id)

    return (
        <div className=" hover:cursor-pointer transform transition duration-300 hover:scale-110 ">
            <div
                key={category?.id}
                className={`w-[180px] h-[62px] flex-shrink-0 rounded-[15px] flex justify-center items-center opacity-0 animate-fadeInRight transition-colors duration-300 ${isSelected ? 'bg-[#6E22DD]' : 'bg-[#6E22DD50]'
                    }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => handleSelectCategory(category.id)}
            >
                <label
                    className={`${isSelected ? 'text-white' : 'text-black'
                        }  text-[16px] font-bold truncate px-4`}
                >
                    {category?.name}
                </label>
            </div>
        </div>
    )
}
