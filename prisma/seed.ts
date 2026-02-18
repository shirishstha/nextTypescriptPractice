import  {PrismaClient}  from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.permission.createMany({
        data: [
            { name: "CREATE_PRODUCT" },
            { name: "UPDATE_PRODUCT" },
            { name: "DELETE_PRODUCT" },
            { name: "GET_PRODUCT" },

            { name: "CREATE_MOD" },
            { name: "UPDATE_MOD" },
            { name: "DELETE_MOD" },
            { name: "GET_MOD" },

            { name: "DELETE_SESSION" },
            { name: "GET_SESSION" }
        ]
    })
    const createProduct = await prisma.permission.findUnique({
        where: { name: "CREATE_PRODUCT" }
    });

    const deleteSession = await prisma.permission.findUnique({
        where: { name: "DELETE_SESSION" }
    });


    if (createProduct && deleteSession) {
        await prisma.rolePermission.createMany({
            data: [
                { role: "ADMIN", permissionId: createProduct.id },
                { role: "MOD", permissionId: deleteSession.id }
            ]
        });
    }

}

main().catch(e => {
    console.error(e);
}).finally(() => prisma.$disconnect());