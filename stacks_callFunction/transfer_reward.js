import { openContractCall } from "@stacks/connect";
import { uintCV, standardPrincipalCV, noneCV, someCV, FungibleConditionCode, createAssetInfo, makeStandardFungiblePostCondition, } from "@stacks/transactions";
import { StacksMocknet } from "@stacks/network";

export default async function transfer_reward(amount, tips_amount, driver, passanger) {
    const network = new StacksMocknet();
    const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
    const cAmount = uintCV(parseInt(amount)+parseInt(tips_amount));
    const cDriver = standardPrincipalCV(driver);
    const cPassanger = standardPrincipalCV(passanger);
    const contractName = 'drive';
    const ctips = uintCV(tips_amount);

    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = parseInt(amount) + parseInt(tips_amount);
    const assetName = 'tokyo-torch-coin';
    const fungibleAssetInfo = createAssetInfo(contractAddress, contractName, assetName);
    
    const standardFungiblePostCondition = makeStandardFungiblePostCondition(
        contractAddress,
        postConditionCode,
        postConditionAmount,
        fungibleAssetInfo
    );
    const postConditions = [
        standardFungiblePostCondition
      ];


    const tips = () => {
        try {
            if (tips_amount > 0) {
                return someCV(ctips);
            }
            else {
                return noneCV();
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    const functionArgs = [cAmount, tips(), cDriver, cPassanger];

    const options = {
        contractAddress,
        functionName: "transfer-rewards",
        contractName,
        functionArgs,
        network,postConditions,
        appDetails: {
            name: "Drive and Earn",
            icon: '',
        },
        onFinish: (data) => {
            window.location.reload();

        }

    };
    await openContractCall(options);
}