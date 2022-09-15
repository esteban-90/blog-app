/**
 * @param {object} props
 * @param {JSX.Element} props.icon
 * @param {string} props.value
 * @param {('text' | 'password' | 'email')} [props.type = 'text']
 * @param {string} props.placeholder
 * @param {(event: React.ChangeEvent) => void} props.changeHandler
 * @param {(event: React.ChangeEvent) => void} props.blurHandler
 * @param {boolean} [props.focus = false]
 * @param {boolean} [props.disabled = false]
 * @returns {JSX.Element}
 */

export default function TextInputLg({
  icon,
  value,
  type = 'text',
  placeholder,
  changeHandler,
  blurHandler,
  focus = false,
  disabled = false,
}) {
  return (
    <div className='flex items-center pl-6 mb-3 bg-white rounded-full'>
      <span className='inline-block pr-3 py-2 border-r border-gray-50'>{icon}</span>

      <input
        value={value}
        className={`
          w-full
          pl-4
          pr-6
          py-4
          font-bol
          placeholder-gray-300
          rounded-r-full
          focus:outline-none
          disabled:bg-slate-50
          disabled:text-slate-500
          disabled:border-slate-200
          disabled:shadow-none
        `}
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
