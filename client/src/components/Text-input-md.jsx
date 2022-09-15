/**
 * @param {object} props
 * @param {JSX.Element} props.icon
 * @param {string} props.value
 * @param {('password' | 'email')} props.type
 * @param {string} props.placeholder
 * @param {(event: React.ChangeEvent) => void} props.changeHandler
 * @param {(event: React.ChangeEvent) => void} props.blurHandler
 * @param {boolean} [props.focus = false]
 * @param {boolean} [props.disabled = false]
 * @returns {JSX.Element}
 */

export default function TextInputMd({
  icon,
  value,
  type,
  placeholder,
  changeHandler,
  blurHandler,
  focus = false,
  disabled = false,
}) {
  return (
    <div className='flex items-center pl-6 mb-3 border border-gray-50 bg-white rounded-full'>
      <span className='inline-block pr-3 border-r border-gray-50'>{icon}</span>

      <input
        value={value}
        className='w-full pr-6 pl-3 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none'
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={blurHandler}
        autoFocus={focus}
        disabled={disabled}
      />
    </div>
  )
}
