async function handleButtonClick(ctx) {
    const { data } = ctx.callbackQuery
    
    await ctx.popup(data)
}


export { handleButtonClick }