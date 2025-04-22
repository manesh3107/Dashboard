const getMethod = async (db, data) => {
  try {
    const userData = await db.find(data);
    return userData;
  } catch (error) {
    return error;
  }
};

const postMethod = async (db,data) => {
  try {
    const newData = await new db(data);
    const savedData = newData.save();
    return savedData;
  } catch (error) {
    return error;
  }
};

const updateMethod = async (db,id, data) => {
  try {
    const updatedData = await db.findByIdAndUpdate(id,data);
    return updatedData;
  } catch (error) {
    return error;
  }
};

const deleteMethod = async (db,id, data) => {
  try {
    const deletedData = await db.findByIdAndUpdate(id,data);
    return true;
  } catch (error) { 
    return error;
  }
};

module.exports = {
  getMethod,
  postMethod,
  updateMethod,
  deleteMethod
};
