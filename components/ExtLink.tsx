import React from "react";
import {ExternalLink} from "lucide-react";
import {cn} from "@/utils/cn";

// Extending React anchor element attributes to include href explicitly
type ExtLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

/**
 * An external link component that appends an external link icon to the end of the link.
 */
const ExtLink: React.FC<ExtLinkProps> = (props) => {
    // Destructure href from props to ensure it's explicitly used
    const {href, className, children, ...rest} = props;
    return (
        <a
            href={href}
            {...rest}
            className={cn("underline inline-flex items-center gap-1", className)}>
            {children} <ExternalLink className={"w-3 h-3"}/>
        </a>
    );
}

export default ExtLink;