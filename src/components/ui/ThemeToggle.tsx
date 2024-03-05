"use client"

import React, {useState, useEffect} from 'react';
import {Switch} from "../shadcn/Switch";
import {Label} from "../shadcn/Label";

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);
  
    useEffect(() => {
      // Apply the theme mode class to the body element
      document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);
  
    const handleToggle = () => {
      setDarkMode(!darkMode);
    };
  
    return (
      <div className="flex items-center space-x-2">
        <Switch id="theme-mode" checked={darkMode} onCheckedChange={handleToggle} />
        <Label htmlFor="theme-mode">Toggle theme</Label>
      </div>
    );
  };
  
  export default ThemeToggle;
  