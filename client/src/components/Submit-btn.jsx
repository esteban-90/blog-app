/**
 * @param {object} props
 * @param {string} props.content
 * @param {boolean} [props.disabled = false]
 * @returns {JSX.Element}
 */

export default function SubmitBtn({ content, disabled = false }) {
  return (
    <button
      type='submit'
      className={`
        py-4
        w-full
        bg-blue-500
        hover:bg-blue-600
        text-white
        font-bold
        rounded-full
        transition
        duration-200
      `}
      disabled={disabled}
    >
      {content}
    </button>
  )
}
