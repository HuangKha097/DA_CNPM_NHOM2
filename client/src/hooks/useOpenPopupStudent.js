const useOpenPopupStudent = (
  setStudentsSelected,
  students,
  setStudentPopUp,
  setSearchValue,
  setShowListStudent
) => {
  const handleOpenStudentPopup = () => {
    setStudentsSelected(students || []);
    setStudentPopUp([]);
    setSearchValue('');
    setShowListStudent(true);
  };
  return { handleOpenStudentPopup };
};
export default useOpenPopupStudent;
