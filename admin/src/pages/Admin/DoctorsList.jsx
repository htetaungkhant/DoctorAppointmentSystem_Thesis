import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { Switch } from '../../components/ui/Switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog'
import LoadingScreen from '../../components/ui/LoadingScreen'

const DoctorsList = () => {
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const { doctors, changeAvailability, deleteDoctor, aToken, getAllDoctors } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      setIsDeleting(true);
      await deleteDoctor(deleteConfirm.id);
      setIsDeleting(false);
      setDeleteConfirm({ show: false, id: null });
    }
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      {isDeleting && <LoadingScreen />}
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group relative' key={index}>
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <button
                onClick={(e) => handleDelete(e, item._id)}
                className='w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-red-50 border border-red-200 transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-3 flex items-center justify-between'>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  item.available 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}>
                  {item.available ? 'Available' : 'Not Available'}
                </div>
                <Switch 
                  checked={item.available}
                  onCheckedChange={() => changeAvailability(item._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={deleteConfirm.show && !isDeleting} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, id: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteConfirm({ show: false, id: null })}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DoctorsList