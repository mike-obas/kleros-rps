'use client'
import * as React from 'react';
import CustomStyles from "@/styles/General";
import CustomItems from './CustomItems';
import GameConsole from './GameConsole';

function LandingPage() {

return (
<CustomStyles.FullHeightBox>
    <CustomItems />
    <GameConsole />
 </CustomStyles.FullHeightBox>
)
}

export default LandingPage