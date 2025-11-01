import * as UserService from '../service/UserService.js';

const useFindStudent = (searchValue, setStudentPopUp, studentsSelected, valueFilter) => {
  const handleFindStudents = async () => {
    try {
      if (!searchValue.trim()) {
        setStudentPopUp(null);
        return;
      }
      let res;
      valueFilter
        ? (res = await UserService.findStudentsByGrade(searchValue))
        : (res = await UserService.findStudentsByStudentNumber(searchValue));
      console.log(res.students);

      const filterStudents = res.students.filter(
        (s) => !studentsSelected.some((sel) => sel._id === s._id)
      );
      if (res.students) {
        const mergedStudents = [...filterStudents, ...studentsSelected];
        setStudentPopUp(mergedStudents);
      } else {
        setStudentPopUp(null);
      }
    } catch (error) {
      console.error('Search student error:', error);
    }
  };
  return { handleFindStudents };
};

export default useFindStudent;
