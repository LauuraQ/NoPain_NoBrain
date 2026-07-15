import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')

export function usePopup() {
    const showPopup = (newTitle, newMessage) => {
        title.value = newTitle
        message.value = newMessage
        isOpen.value = true
    }

    const closePopup = () => {
        isOpen.value = false
    }

    return {
        isOpen,
        title,
        message,
        showPopup,
        closePopup
    }
}