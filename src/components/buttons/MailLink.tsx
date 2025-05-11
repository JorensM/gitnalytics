import clsx from 'clsx'

type MailLinkProps = {
    text?: string // Text to display. Default is the email address
    className?: string // Custom className
}

export default function MailLink( props: MailLinkProps ) {
    return (
        <a className={clsx(props.className, 'text-blue-400')} href='mailto:printystudios@gmail.com'>
            {props.text || "printystudios@gmail.com"}
        </a>
    )
}