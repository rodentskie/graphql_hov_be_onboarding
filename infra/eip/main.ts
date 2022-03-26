import { Construct } from "constructs";
import { App, TerraformStack, S3Backend, TerraformOutput } from "cdktf";
import { AwsProvider, ec2 } from "@cdktf/provider-aws";

class EipStack extends TerraformStack {
  public id: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-southeast-1",
    });

    const eip = new ec2.Eip(this, "eip_dev", {
      vpc: true,
      tags: {
        Name: "eip_dev",
        Environment: "dev",
        Terraform: "true",
      },
    });

    this.id = eip.id;

    new TerraformOutput(this, "eip_id", {
      value: eip.id,
    });

    new S3Backend(this, {
      bucket: "onewallet-cdktf-test",
      key: "cdktf/eip.json",
      region: "ap-southeast-1",
    });
  }

  public getId() {
    return this.id;
  }
}

const app = new App();
new EipStack(app, "eip");

app.synth();
