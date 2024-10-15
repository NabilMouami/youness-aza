const CategoryLevel = ({ genre, setGenre }) => {
  const handleCheckboxChange = (e, setState) => {
    const { checked, value } = e.target;
    setState((prev) =>
      checked ? [...prev, value] : prev.filter((genre) => genre !== value)
    );
  };

  const Categories = [
    {
      id: 1,
      name: "homme",
      value: "homme",
      isChecked: false,
    },
    {
      id: 2,
      name: "femme",
      value: "femme",
      isChecked: false,
    },
    {
      id: 3,
      name: "enfant",
      value: "enfant",
      isChecked: false,
    },
  ];

  return (
    <>
      {Categories?.map((item) => (
        <div className="form-check" key={item.id}>
          <input
            className="form-check-input"
            type="checkbox"
            checked={genre.includes(item.value)}
            value={item.value}
            onChange={(e) => handleCheckboxChange(e, setGenre)}
          />
          <label className="form-check-label">{item.name}</label>
        </div>
      ))}
    </>
  );
};

export default CategoryLevel;
