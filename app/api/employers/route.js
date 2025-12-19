import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } =
      await supabaseServer.auth.getUser(token);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { status: "error", message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;
    const formData = await req.formData();

    const companyName = String(formData.get("company_name") || "").trim();
    const website = String(formData.get("website") || "").trim();
    const industry = String(formData.get("industry") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const logoFile = formData.get("logo");

    if (!companyName) {
      return NextResponse.json(
        { status: "error", message: "Company name is required" },
        { status: 400 }
      );
    }

    let logoUrl = null;

    if (logoFile && typeof logoFile === "object" && logoFile.size > 0) {
      const ext = logoFile.name.split(".").pop() || "png";
      const filePath = `company-logos/${userId}-${crypto.randomUUID()}.${ext}`;

      const buffer = Buffer.from(await logoFile.arrayBuffer());

      const { error: uploadError } = await supabaseServer.storage
        .from("company-logos")
        .upload(filePath, buffer, {
          contentType: logoFile.type,
          upsert: true,
        });

      if (uploadError) {
        return NextResponse.json(
          { status: "error", message: uploadError.message },
          { status: 500 }
        );
      }

      const { data } = supabaseServer.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      logoUrl = data.publicUrl;
    }

    const { error: insertError } = await supabaseServer
      .from("employers")
      .insert({
        user_id: userId,
        company_name: companyName,
        logo_url: logoUrl,
        website,
        industry,
        location,
        description,
      });

    if (insertError) {
      return NextResponse.json(
        { status: "error", message: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: "success", message: "Company profile created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create employer error:", err);

    return NextResponse.json(
      { status: "error", message: "Unexpected server error" },
      { status: 500 }
    );
  }
}
