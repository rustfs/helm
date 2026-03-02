# About RustFS

[RustFS](https://github.com/rustfs/rustfs) is a high-performance, distributed object storage system built in Rust., one of the most popular languages worldwide. RustFS combines the simplicity of MinIO with the memory safety and performance of Rust., S3 compatibility, open-source nature, support for data lakes, AI, and big data. Furthermore, it has a better and more user-friendly open-source license in comparison to other storage systems, being constructed under the Apache license. As Rust serves as its foundation, RustFS provides faster speed and safer distributed features for high-performance object storage.

# RustFS Helm Mode

RustFS helm chart supports **standalone and distributed mode**. For standalone mode, there is only one pod and one pvc; for distributed mode, there are two styles, 4 pods and 16 pvcs(each pod has 4 pvcs), 16 pods and 16 pvcs(each pod has 1 pvc). You should decide which mode and style suits for your situation. You can specify the parameters `mode` and `replicaCount` to install different mode and style.

- **For standalone mode**: Only one pod and one pvc acts as single node single disk; Specify parameters `mode.standalone.enabled="true",mode.distributed.enabled="false"` to install.
- **For distributed mode**(**default**): Multiple pods and multiple pvcs, acts as multiple nodes multiple disks, there are two styles:
    - 4 pods and each pods has 4 pvcs(**default**)
    - 16 pods and each pods has 1 pvc: Specify parameters `replicaCount` with `--set replicaCount="16"` to install.

**NOTE**: Please make sure which mode suits for you situation and specify the right parameter to install rustfs on kubernetes.

# Parameters Overview

| parameter | description | default value |
| -- | -- | -- |
| replicaCount   | Number of cluster nodes.   |  `4`. |
| mode.standalone.enabled | RustFS standalone mode support, namely one pod one pvc. | `false` |
| mode.distributed.enabled | RustFS distributed mode support, namely multiple pod multiple pvc. | `true`. |
| image.repository  | docker image repository.   |  rustfs/rustfs.  |
| image.tag | the tag for rustfs docker image | "latest" |
| secret.rustfs.access_key | RustFS Access Key ID | `rustfsadmin` |
| secret.rustfs.secret_key | RustFS Secret Key ID | `rustfsadmin` |
| storageclass.name | The name for StorageClass. | `local-path` |
| ingress.className | Specify the ingress class, traefik or nginx. | `traefik` |
| tls.enabled | Enable or disable tls for ingress. | `false` |
| tls.crt | The content of certificate file| none |
| tls.key | The content of key file | none|

**NOTE**: [`local-path`](https://github.com/rancher/local-path-provisioner) is used by k3s. If you want to use `local-path`, running the command,

```
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.32/deploy/local-path-storage.yaml
```

# Installation

## Requirement

* Helm V3
* RustFS >= 1.0.0-alpha.69

Due to the traefik and ingress has different session sticky/affinity annotations, and rustfs support both those two controller, you should specify parameter `ingress.className` to select the right one which suits for you.

## Adding the Helm Repository

Before you can use the chart referenced with `rustfs/rustfs` you will need to add or update the RustFS helm repository:

```
helm repo add rustfs https://rustfs.github.io/helm/
```

## Installation with traekfik controller

If your ingress class is `traefik`, running the command:

```
helm install rustfs rustfs/rustfs -n rustfs --create-namespace --set ingress.className="traefik"
```

## Installation with nginx controller

If your ingress class is `nginx`, running the command:

```
helm install rustfs rustfs/rustfs -n rustfs --create-namespace --set ingress.className="nginx"
```

# Installation check and rustfs login

Check the pod status

```
kubectl -n rustfs get pods -w
NAME       READY   STATUS    RESTARTS        AGE
rustfs-0   1/1     Running   0               2m27s
rustfs-1   1/1     Running   0               2m27s
rustfs-2   1/1     Running   0               2m27s
rustfs-3   1/1     Running   0               2m27s
```

Check the ingress status

```
kubectl -n rustfs get ing
NAME     CLASS   HOSTS            ADDRESS         PORTS     AGE
rustfs   nginx   your.rustfs.com   10.43.237.152   80, 443   29m
```

Access the rustfs cluster via `https://your.rustfs.com` with the default username and password `rustfsadmin`.

> Replace the `your.rustfs.com` with your own domain as well as the certificates.

# TLS configuration

By default, tls is not enabled.If you want to enable tls(recommendated),you can follow below steps:

* Step 1: Certification generation

You can request cert and key from CA or use the self-signed cert(**not recommendated on prod**),and put those two files(eg, `tls.crt` and `tls.key`) under some directory on server, for example `tls` directory.

* Step 2: Certification specifying

You should use `--set-file` parameter when running `helm install` command, for example, running the below command can enable ingress tls and generate tls secret:

```
helm install rustfs rustfs/rustfs -n rustfs --set tls.enabled=true,--set-file tls.crt=./tls.crt,--set-file tls.key=./tls.key
```

# Uninstall

Uninstalling the rustfs installation with command,

```
helm uninstall rustfs -n rustfs
```
