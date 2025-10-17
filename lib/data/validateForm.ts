export const validateForm = (formData: any) => {
  let errors = {
    age: "",
    height: "",
    weight: "",
  };

  // Kiểm tra tuổi tối thiểu
  if (parseInt(formData.age) < 6) {
    errors.age = "Tuổi tối thiểu để học bơi là 6 tuổi.";
  }

  // Kiểm tra chiều cao tối thiểu
  if (parseInt(formData.height) < 100) {
    errors.height = "Chiều cao tối thiểu là 100cm.";
  }

  // Kiểm tra cân nặng tối thiểu
  if (parseInt(formData.weight) < 20) {
    errors.weight = "Cân nặng tối thiểu là 20kg.";
  }

  return errors;
};
