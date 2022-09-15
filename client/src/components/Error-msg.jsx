/**
 * @param {object} props
 * @param {string} props.content
 * @returns {JSX.Element}
 */

export default function ErrorMsg({ content }) {
  return <div className='text-red-400 mb-3'>{content}</div>
}
