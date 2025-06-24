import { InputHTMLAttributes, JSX, ReactElement } from 'react'

{
    /* <Form<{user:"text", age:"number"}> action={...}>
  <input type="text" name="user" />
  <input type="number" name="age" />
  <button type="submit">Submit</button>
</Form> */
}

type InputTypeMap = {
    text: string
    number: number
}

export function Form<T extends Record<string, keyof InputTypeMap>>(
    props: InputHTMLAttributes<HTMLFormElement> & {
        children: ReactElement<T> | ReactElement<T>[]
    },
) {
    return <form {...props}>{props.children}</form>
}

function Intpu(): JSX.Element {
    return (
        <Form<{ user: 'text'; age: 'number' }>>
            <input type='text' name='user' />
            <button type='submit'>Submit</button>
        </Form>
    )
}
