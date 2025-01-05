import React from "react"

    export interface GeneralTypes {
    textVariant: "h1" | "h2" | "h3" |  "h4" |  "h5" |  "h6" |  "subtitle1" |  "subtitle2" |  "body1" |  "body2" |  "inherit" | "caption" 
    buttonVariant: "text" | "contained" | "outlined"
    color: "primary" | "secondary" | 'success' | 'error' | 'info' | 'warning'
    onChange: React.ChangeEvent<HTMLInputElement>
}