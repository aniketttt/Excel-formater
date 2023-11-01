# Initialize the Terraform configuration
provider "aws" {
  region = "us-east-1"  # Set your desired AWS region
}

# Create a security group that allows incoming SSH and HTTP traffic
resource "aws_security_group" "example" {
  name        = "example"
  description = "Example security group"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Launch an EC2 instance
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"  # Replace with your desired AMI ID
  instance_type = "t2.micro"
  key_name      = "your-ssh-key"  # Replace with your SSH key name
  security_groups = [aws_security_group.example.name]

  tags = {
    Name = "ExampleInstance"
  }
}

# Output the public IP address of the created instance
output "public_ip" {
  value = aws_instance.example.public_ip
}
