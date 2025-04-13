export async function setup(ctx) {
	let moduleName = 'src/main.mjs';

    const module = await ctx.loadModule(moduleName);
    module.setup(ctx);
}
