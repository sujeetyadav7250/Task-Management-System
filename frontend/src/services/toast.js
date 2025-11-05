import { toast } from 'react-toastify'

export const toastService = {
  // Success toast
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  },

  // Error toast
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  },

  // Warning toast
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  },

  // Info toast
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  },

  // Loading toast (returns toastId for updating)
  loading: (message = "Loading...") => {
    return toast.loading(message, {
      position: "top-right",
    })
  },

  // Update existing toast
  update: (toastId, config) => {
    toast.update(toastId, config)
  },

  // Dismiss toast
  dismiss: (toastId) => {
    toast.dismiss(toastId)
  }
}