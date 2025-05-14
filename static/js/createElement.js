// https://dev.to/ahmedadel/custom-javascript-createelement-function-244f

function createElement(elementType, props, children) {
    const element = document.createElement(elementType)
    for (const prop in props) {
        if (prop === 'style') {
            Object.keys(props.style).forEach((styleName) => {
                element.style[styleName] = props.style[styleName]
            });
        } else if (props[prop] !== null) {
            element[prop] = props[prop];
        }
    }

    if (!Array.isArray(children)) {
        children = [children];
    }

    if (children) {
        children.forEach((child) => {
            if (typeof child === "string" || typeof child === "number") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    }

    return element;
}

// https://javascript.plainenglish.io/creating-a-custom-react-createelement-like-function-in-vanilla-javascript-dea72e617169

const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

const booleanAttributes = [
    "disabled",
    "checked",
    "readonly",
    "multiple",
    "required",
    "autofocus",
];


function advancedCreateElement({
    tag,
    id = `${tag} default ID`,
    className = tag,
    classes = [],
    attributes = {},
    events = {},
    children = [],
} = {}) {
    const element = document.createElement(tag);
    element.id = id;

    // Handle classes
    element.className = [className, ...classes].join(" ").trim();

    // Handle attributes
    Object.keys(attributes).forEach((attr) => {
        if (booleanAttributes.includes(attr)) {
            if (attributes[attr]) {
                element.setAttribute(attr, attr);
            } else {
                element.removeAttribute(attr);
            }
        } else {
            element.setAttribute(attr, attributes[attr]);
        }
    });

    // Add event listeners
    Object.keys(events).forEach((event) =>
        element.addEventListener(event, events[event])
    );

    // Handle children
    if (!voidElements.includes(tag.toLowerCase())) {
        if (!Array.isArray(children)) {
            children = [children];
        }

        children.forEach((child) => {
            if (typeof child === "string" || typeof child === "number") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    }
    return element;
};